import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { OrderType, PaymentMethod } from '../../types/database.types';
import { IndianState, IndianAddress } from '../../types/india.types';
import { INDIAN_STATES, isValidPincode } from '../../utils/address';
import { isValidIndianMobile, normalizeIndianPhone } from '../../utils/phone';
import { formatINR } from '../../utils/currency';
import { validatePromoCode } from '../../utils/promo';
import { AppliedDiscount, CheckoutPayload, PlacedOrder } from '../../types/order.types';
import { ordersService } from '../../services/orders.service';
import { paymentService } from '../../services/payment.service';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  Clock,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Send,
  Sparkles,
  MapPin,
  Coffee,
  Check,
  Tag,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlacedSuccess?: (order: PlacedOrder) => void;
}

type Step = 'order_type' | 'customer_details' | 'payment' | 'review' | 'confirmation';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlacedSuccess,
}) => {
  const { items, subtotal, deliveryFee: baseDeliveryFee, clearCart } = useCart();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<Step>('order_type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  // Step 1: Order Type State
  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [tableNumber, setTableNumber] = useState<string>('Table 4');
  const [pickupSlot] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledPickupTime, setScheduledPickupTime] = useState<string>('Today in 30 mins');

  // Delivery Address State (if delivery)
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<IndianAddress>>({
    buildingOrHouse: '',
    street: '',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    landmark: '',
    country: 'India',
  });

  // Step 2: Customer Contact State
  const [fullName, setFullName] = useState<string>('Aarav Sharma');
  const [phone, setPhone] = useState<string>('9845018960');
  const [email, setEmail] = useState<string>('aarav.sharma@example.com');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Step 3: Payment & Promo State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [customUpiId, setCustomUpiId] = useState<string>('');
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Discount calculation
  const discountAmount = appliedDiscount ? appliedDiscount.discountAmount : 0;
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 500 ? 0 : baseDeliveryFee || 50) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const calculatedGst = Math.round((taxableSubtotal * 0.05) * 100) / 100;
  const finalTotal = taxableSubtotal + calculatedGst + deliveryFee;

  // Handle Promo Code Apply
  const handleApplyPromo = () => {
    setPromoError(null);
    const result = validatePromoCode(promoInput, subtotal);
    if (result.error) {
      setPromoError(result.error);
      setAppliedDiscount(null);
    } else if (result.discount) {
      setAppliedDiscount(result.discount);
      setPromoInput('');
    }
  };

  // Step Navigation & Validation
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 'order_type') {
      if (orderType === 'dine_in' && !tableNumber.trim()) {
        errors.tableNumber = 'Please specify your table or bar seat number.';
      }
      if (orderType === 'delivery') {
        if (!deliveryAddress.street?.trim()) errors.street = 'Street address is required.';
        if (!deliveryAddress.city?.trim()) errors.city = 'City is required.';
        if (!deliveryAddress.pincode || !isValidPincode(deliveryAddress.pincode)) {
          errors.pincode = 'Please enter a valid 6-digit PIN code.';
        }
      }
    }

    if (currentStep === 'customer_details') {
      if (!fullName.trim()) errors.fullName = 'Full name is required.';
      if (!isValidIndianMobile(phone)) {
        errors.phone = 'Please enter a valid 10-digit Indian mobile number (+91).';
      }
      if (!email.trim() || !email.includes('@')) {
        errors.email = 'Please provide a valid email address for receipt.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep === 'order_type') setCurrentStep('customer_details');
    else if (currentStep === 'customer_details') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('review');
  };

  const handleBack = () => {
    if (currentStep === 'customer_details') setCurrentStep('order_type');
    else if (currentStep === 'payment') setCurrentStep('customer_details');
    else if (currentStep === 'review') setCurrentStep('payment');
  };

  // Final Order Placement
  const handlePlaceOrder = async () => {
    setOrderError(null);

    // STEP 1: Validate cart
    if (!items || items.length === 0) {
      setOrderError('Your cart is empty. Please add coffee or bakery items before placing an order.');
      return;
    }

    const hasInvalidItem = items.some((it) => !it.menuItem || !it.quantity || it.quantity <= 0 || it.unitPrice < 0);
    if (hasInvalidItem) {
      setOrderError('One or more items in your cart has an invalid quantity or price.');
      return;
    }

    setIsSubmitting(true);

    const payload: CheckoutPayload = {
      orderType,
      dineIn: orderType === 'dine_in' ? { tableNumber } : undefined,
      pickup: orderType === 'pickup' ? { slot: pickupSlot, scheduledTime: scheduledPickupTime } : undefined,
      deliveryAddress: orderType === 'delivery' ? (deliveryAddress as IndianAddress) : undefined,
      customer: {
        fullName: fullName.trim(),
        phone: normalizeIndianPhone(phone),
        email: email.trim(),
        notes: specialNotes.trim() || undefined,
      },
      paymentMethod,
      upiId: paymentMethod === 'upi' ? (customUpiId || 'estate1896@okhdfcbank') : undefined,
      discount: appliedDiscount || undefined,
      items,
      subtotal,
      tax: calculatedGst,
      deliveryFee,
      discountAmount,
      total: finalTotal,
    };

    try {
      if (paymentMethod === 'cash_on_pickup') {
        // Direct cash on pickup placement
        const { data, error } = await ordersService.placeOrder(payload);
        if (error || !data) {
          throw new Error(error?.message || 'Failed to complete order. Please try again.');
        }

        setPlacedOrder(data);
        setCurrentStep('confirmation');
        clearCart();

        if (onOrderPlacedSuccess) {
          onOrderPlacedSuccess(data);
        }
        setIsSubmitting(false);
      } else {
        // Online Payment via Razorpay Test Mode (UPI / Card)
        await paymentService.openCheckout({
          amount: finalTotal,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: normalizeIndianPhone(phone),
          orderDescription: `Estate 1896: ${items.length} items (${orderType})`,
          receipt: `rcpt_${Date.now()}`,
          onSuccess: async (paymentResponse) => {
            try {
              const verifiedPayload: CheckoutPayload = {
                ...payload,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              };

              const { data, error } = await ordersService.placeOrder(verifiedPayload);
              if (error || !data) {
                throw new Error(error?.message || 'Failed to complete order. Please try again.');
              }

              setPlacedOrder(data);
              setCurrentStep('confirmation');
              clearCart();

              if (onOrderPlacedSuccess) {
                onOrderPlacedSuccess(data);
              }
            } catch (postPayErr) {
              console.error('Post-payment order finalization error:', postPayErr);
              setOrderError(postPayErr instanceof Error ? postPayErr.message : 'Order creation failed after payment.');
            } finally {
              setIsSubmitting(false);
            }
          },
          onDismiss: () => {
            setIsSubmitting(false);
          },
          onError: (payErr) => {
            console.error('Razorpay payment error:', payErr);
            setOrderError(payErr.message || 'Payment failed or was cancelled.');
            setIsSubmitting(false);
          },
        });
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setOrderError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-roast-900 via-espresso-900 to-espresso-950 border border-roast-700/90 rounded-2xl shadow-warm-lg flex flex-col overflow-hidden max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-roast-800 flex items-center justify-between bg-espresso-950/90">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="copper" size="sm">
                Estate 1896 Checkout
              </Badge>
              {currentStep !== 'confirmation' && (
                <span className="text-[11px] font-mono text-cream-400">
                  Step{' '}
                  {currentStep === 'order_type'
                    ? '1 of 4'
                    : currentStep === 'customer_details'
                    ? '2 of 4'
                    : currentStep === 'payment'
                    ? '3 of 4'
                    : '4 of 4'}
                </span>
              )}
            </div>
            <h3 id="checkout-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
              {currentStep === 'order_type' && 'Choose Your Order Type'}
              {currentStep === 'customer_details' && 'Guest & Contact Information'}
              {currentStep === 'payment' && 'Select Payment Method'}
              {currentStep === 'review' && 'Review Your Coffee Order'}
              {currentStep === 'confirmation' && 'Order Confirmed!'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-2 rounded-full text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors',
              FOCUS_RING_CLASSES
            )}
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* ================= STEP 1: ORDER TYPE ================= */}
          {currentStep === 'order_type' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'dine_in', label: 'Dine In', desc: 'At our café tables', icon: Utensils },
                  { id: 'takeaway', label: 'Takeaway', desc: 'Grab & go counter', icon: Coffee },
                  { id: 'pickup', label: 'Curbside', desc: 'Scheduled ready', icon: Clock },
                  { id: 'delivery', label: 'Delivery', desc: 'To your doorstep', icon: Truck },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = orderType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setOrderType(type.id as OrderType)}
                      className={cn(
                        'p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2',
                        FOCUS_RING_CLASSES,
                        isSelected
                          ? 'bg-caramel-500/20 border-caramel-500 text-cream-50 font-semibold shadow-warm-sm'
                          : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                          isSelected ? 'bg-caramel-500 text-espresso-950' : 'bg-roast-800 text-caramel-400'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-serif text-sm font-bold">{type.label}</p>
                        <p className="text-[10px] font-sans text-cream-400 mt-0.5">{type.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dine In Sub-Form */}
              {orderType === 'dine_in' && (
                <div className="p-4 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-3">
                  <label htmlFor="table-number" className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                    Select / Enter Table Number
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Table 1', 'Table 2', 'Table 4', 'Table 8', 'Bar Counter 1', 'Garden Patio 3'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTableNumber(t)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer',
                          tableNumber === t
                            ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold'
                            : 'bg-roast-900 text-cream-300 border-roast-700 hover:border-roast-600'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {formErrors.tableNumber && (
                    <p className="text-xs text-red-400 font-sans">{formErrors.tableNumber}</p>
                  )}
                </div>
              )}

              {/* Pickup Sub-Form */}
              {orderType === 'pickup' && (
                <div className="p-4 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                    Pickup Time Slot
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'ASAP (~15 mins)',
                      'In 30 mins',
                      'In 45 mins',
                      'In 1 hour',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setScheduledPickupTime(slot)}
                        className={cn(
                          'p-2.5 rounded-lg border text-xs font-mono text-center transition-colors cursor-pointer',
                          scheduledPickupTime === slot
                            ? 'bg-copper-500 text-cream-50 border-copper-400 font-bold'
                            : 'bg-roast-900 text-cream-300 border-roast-700 hover:border-roast-600'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address Sub-Form (India-First) */}
              {orderType === 'delivery' && (
                <div className="p-4 sm:p-5 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-caramel-400 font-semibold block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Indian Delivery Address Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="flat-house" className="text-[11px] font-mono text-cream-400 block mb-1">
                        Flat / House / Building
                      </label>
                      <input
                        id="flat-house"
                        type="text"
                        value={deliveryAddress.buildingOrHouse || ''}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, buildingOrHouse: e.target.value })
                        }
                        placeholder="e.g. 402, Oakwood Manor"
                        className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="street-area" className="text-[11px] font-mono text-cream-400 block mb-1">
                        Street / Area *
                      </label>
                      <input
                        id="street-area"
                        type="text"
                        value={deliveryAddress.street || ''}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                        }
                        placeholder="e.g. 100ft Road, 12th Main"
                        className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                      {formErrors.street && <p className="text-[10px] text-red-400 mt-1">{formErrors.street}</p>}
                    </div>

                    <div>
                      <label htmlFor="city-input" className="text-[11px] font-mono text-cream-400 block mb-1">
                        City *
                      </label>
                      <input
                        id="city-input"
                        type="text"
                        value={deliveryAddress.city || ''}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                        }
                        placeholder="e.g. Bengaluru"
                        className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="state-select" className="text-[11px] font-mono text-cream-400 block mb-1">
                        State / UT *
                      </label>
                      <select
                        id="state-select"
                        value={deliveryAddress.state || 'Karnataka'}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, state: e.target.value as IndianState })
                        }
                        className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pincode-input" className="text-[11px] font-mono text-cream-400 block mb-1">
                        6-Digit PIN Code *
                      </label>
                      <input
                        id="pincode-input"
                        type="text"
                        maxLength={6}
                        value={deliveryAddress.pincode || ''}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })
                        }
                        placeholder="e.g. 560038"
                        className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                      {formErrors.pincode && <p className="text-[10px] text-red-400 mt-1">{formErrors.pincode}</p>}
                    </div>

                    <div>
                      <label htmlFor="landmark-input" className="text-[11px] font-mono text-cream-400 block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        id="landmark-input"
                        type="text"
                        value={deliveryAddress.landmark || ''}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })
                        }
                        placeholder="e.g. Opposite Metro Pillar 42"
                        className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-sans text-cream-100 focus:outline-none focus:border-caramel-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: CUSTOMER DETAILS ================= */}
          {currentStep === 'customer_details' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="customer-name" className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block mb-1">
                  Your Full Name *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full p-3 bg-espresso-950 border border-roast-700 rounded-lg text-sm text-cream-100 focus:outline-none focus:border-caramel-500"
                />
                {formErrors.fullName && <p className="text-xs text-red-400 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="customer-phone" className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block mb-1">
                  Mobile Number (+91 for WhatsApp Updates) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-copper-400 font-bold">
                    +91
                  </span>
                  <input
                    id="customer-phone"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98450 18960"
                    className="w-full pl-12 pr-4 p-3 bg-espresso-950 border border-roast-700 rounded-lg text-sm font-mono text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                </div>
                {formErrors.phone && <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label htmlFor="customer-email" className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block mb-1">
                  Email Address (For Tax Invoice & Receipt) *
                </label>
                <input
                  id="customer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.sharma@example.com"
                  className="w-full p-3 bg-espresso-950 border border-roast-700 rounded-lg text-sm text-cream-100 focus:outline-none focus:border-caramel-500"
                />
                {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="chef-notes" className="text-xs font-mono uppercase tracking-wider text-cream-400 block mb-1">
                  Barista / Kitchen Notes (Optional)
                </label>
                <textarea
                  id="chef-notes"
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Extra hot milk, sugar on the side..."
                  className="w-full p-3 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-200 focus:outline-none focus:border-caramel-500"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 3: PAYMENT METHOD ================= */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                  Select Payment Option
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI Instant Pay', desc: 'GPay, PhonePe, Paytm', icon: QrCode },
                    { id: 'card', label: 'Card Payment', desc: 'Credit / Debit Cards', icon: CreditCard },
                    { id: 'cash_on_pickup', label: 'Cash on Counter', desc: 'Pay at café', icon: Banknote },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = paymentMethod === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                        className={cn(
                          'p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
                          FOCUS_RING_CLASSES,
                          isSelected
                            ? 'bg-caramel-500/20 border-caramel-500 text-cream-50 shadow-warm-sm'
                            : 'bg-espresso-950/60 border-roast-800 text-cream-300 hover:border-roast-700'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={cn('w-5 h-5', isSelected ? 'text-caramel-400' : 'text-copper-400')} />
                          {isSelected && <Check className="w-4 h-4 text-caramel-400" />}
                        </div>
                        <div>
                          <p className="font-serif text-sm font-bold text-cream-100">{p.label}</p>
                          <p className="text-[11px] font-sans text-cream-400">{p.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UPI Sub-Options */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-caramel-400 font-semibold block">
                    Choose UPI App or Enter UPI ID
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.toLowerCase())}
                        className={cn(
                          'p-2.5 rounded-lg border text-xs font-mono text-center transition-colors cursor-pointer',
                          selectedUpiApp === app.toLowerCase()
                            ? 'bg-roast-800 text-caramel-300 border-caramel-500 font-bold'
                            : 'bg-roast-900/60 text-cream-400 border-roast-700 hover:border-roast-600'
                        )}
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="text"
                      value={customUpiId}
                      onChange={(e) => setCustomUpiId(e.target.value)}
                      placeholder="Or enter UPI ID (e.g. mobile@okaxis)"
                      className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none focus:border-caramel-500"
                    />
                  </div>
                </div>
              )}

              {/* Card Sub-Options */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-caramel-400 font-semibold block">
                    Card Information
                  </span>
                  <input
                    type="text"
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    defaultValue="4532 •••• •••• 8912"
                    className="w-full p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/29"
                      className="p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="•••"
                      className="p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono text-cream-100 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Promo Code Input Section */}
              <div className="p-4 rounded-xl bg-espresso-950/80 border border-roast-800 space-y-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-caramel-400" />
                  Have a Roastery Promo Code?
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Try ESTATE10 or FIRSTBREW"
                    className="flex-1 p-2.5 bg-roast-900 border border-roast-700 rounded-lg text-xs font-mono uppercase text-cream-100 placeholder:text-cream-500 focus:outline-none focus:border-caramel-500"
                  />
                  <Button variant="outline" size="sm" onClick={handleApplyPromo} className="text-xs">
                    Apply
                  </Button>
                </div>

                {appliedDiscount && (
                  <div className="p-2 bg-emerald-950/60 border border-emerald-800 rounded text-xs text-emerald-300 font-mono flex items-center justify-between">
                    <span>✓ Applied {appliedDiscount.code} (-{formatINR(appliedDiscount.discountAmount)})</span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      className="text-cream-400 hover:text-cream-100 text-[10px] underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && <p className="text-xs text-amber-400 font-sans">{promoError}</p>}
              </div>
            </div>
          )}

          {/* ================= STEP 4: ORDER REVIEW ================= */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Order Items Review */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cream-300 font-semibold block">
                  1. Order Summary ({items.length} unique items)
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((line) => (
                    <div
                      key={line.id}
                      className="p-3 bg-espresso-950/70 border border-roast-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-serif font-bold text-cream-100 truncate">
                          {line.menuItem.name} <span className="font-mono text-caramel-400">x{line.quantity}</span>
                        </p>
                        <p className="text-[10px] font-sans text-cream-400 truncate">
                          {[
                            line.customization.size,
                            line.customization.milk,
                            line.customization.temperature,
                            ...line.customization.extras.map((e) => e.name),
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <span className="font-mono font-semibold text-cream-100 shrink-0">
                        {formatINR(line.totalPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order & Customer Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-espresso-950/70 border border-roast-800 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400">
                    Order Type & Fulfilment
                  </span>
                  <p className="font-serif font-bold text-cream-100 uppercase">{orderType.replace('_', ' ')}</p>
                  {orderType === 'dine_in' && <p className="text-cream-300">{tableNumber}</p>}
                  {orderType === 'pickup' && <p className="text-cream-300">{scheduledPickupTime}</p>}
                  {orderType === 'delivery' && (
                    <p className="text-cream-300 truncate">
                      {deliveryAddress.buildingOrHouse} {deliveryAddress.street}, {deliveryAddress.city} -{' '}
                      {deliveryAddress.pincode}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-espresso-950/70 border border-roast-800 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400">
                    Customer & Payment
                  </span>
                  <p className="font-serif font-bold text-cream-100">{fullName}</p>
                  <p className="text-cream-300 font-mono">+91 {phone}</p>
                  <p className="text-caramel-300 font-mono uppercase font-semibold">
                    Payment: {paymentMethod.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 bg-roast-900/60 border border-roast-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between text-cream-300">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedDiscount?.code})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cream-400">
                  <span>GST (5% — CGST 2.5% + SGST 2.5%)</span>
                  <span>{formatINR(calculatedGst, { showDecimals: true })}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-cream-400">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE (Above ₹500)' : formatINR(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cream-50 text-base font-bold pt-2 border-t border-roast-700">
                  <span>Total Amount Payable</span>
                  <span className="text-caramel-300">{formatINR(finalTotal, { showDecimals: true })}</span>
                </div>
              </div>

              {orderError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-mono">
                  {orderError}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 5: CONFIRMATION ================= */}
          {currentStep === 'confirmation' && placedOrder && (
            <div className="py-6 text-center space-y-6">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-warm-lg">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <Badge variant="caramel" size="sm">
                  <Sparkles className="w-3 h-3 text-caramel-400" />
                  Order Placed Successfully
                </Badge>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 pt-1">
                  Thank You, {placedOrder.customer.fullName}!
                </h3>
                <p className="text-xs text-cream-300 font-mono">
                  Order Reference:{' '}
                  <span className="text-caramel-300 font-bold">{placedOrder.orderNumber}</span>
                </p>
              </div>

              {/* Order Status Timeline Tracker */}
              <div className="p-4 sm:p-5 rounded-xl bg-espresso-950 border border-roast-800 text-left space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cream-400 uppercase">Live Preparation Tracker</span>
                  <span className="text-copper-300 font-bold">
                    Estimated Time: ~{placedOrder.estimatedTimeMinutes} Mins
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded bg-caramel-500/20 border border-caramel-500 text-cream-50 font-bold">
                    1. Order Received ✓
                  </div>
                  <div className="p-2 rounded bg-roast-800 border border-roast-700 text-cream-300">
                    2. Brewing & Extraction
                  </div>
                  <div className="p-2 rounded bg-roast-900 border border-roast-800 text-cream-400">
                    3. Ready / Fulfilled
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Order Link */}
              <div className="pt-2">
                <a
                  href={generateWhatsAppOrderUrl({
                    storePhone: '7407004397',
                    customerName: placedOrder.customer.fullName,
                    orderType: placedOrder.orderType,
                    items: placedOrder.items.map((line) => ({
                      productId: line.menuItem.id,
                      productName: line.menuItem.name,
                      unitPrice: line.unitPrice,
                      quantity: line.quantity,
                      selectedOptions: [],
                      itemTotal: line.totalPrice,
                    })),
                    subtotal: placedOrder.subtotal,
                    total: placedOrder.total,
                    specialNotes: `Order #${placedOrder.orderNumber}`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/80 rounded-lg p-3 text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Receive WhatsApp Receipt & Live Updates (+91)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-roast-800 bg-espresso-950 flex items-center justify-between gap-3">
          {currentStep !== 'confirmation' ? (
            <>
              {currentStep !== 'order_type' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Back
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-cream-400">
                  Cancel
                </Button>
              )}

              {currentStep !== 'review' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-xs font-bold"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handlePlaceOrder}
                  isLoading={isSubmitting}
                  className="text-xs font-bold shadow-warm-lg bg-caramel-500"
                >
                  Confirm & Place Order ({formatINR(finalTotal, { showDecimals: true })})
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center text-xs font-bold"
              onClick={onClose}
            >
              Back to Café
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
