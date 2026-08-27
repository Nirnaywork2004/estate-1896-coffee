/**
 * Static & Default Café Configuration (India)
 */

export const STORE_CONFIG = {
  brand: {
    name: 'Estate 1896',
    fullName: 'Estate 1896 Artisanal Coffee Roastery',
    tagline: 'Cinematic Indian Specialty Coffee Experience',
    foundedYear: 1896,
  },
  contact: {
    phoneDisplay: '+91 98450 18960',
    phoneRaw: '9845018960',
    whatsappDisplay: '+91 98450 18960',
    whatsappRaw: '9845018960',
    email: 'hello@estate1896.coffee',
    address: {
      buildingOrHouse: 'The Heritage Villa, No. 42',
      street: '100 Feet Road, 12th Main',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka' as const,
      pincode: '560038',
      country: 'India' as const,
    },
  },
  ordering: {
    currency: 'INR',
    currencySymbol: '₹',
    gstRatePercent: 5.0, // 2.5% CGST + 2.5% SGST
    deliveryFee: 50,
    freeDeliveryThreshold: 500,
    upiId: 'estate1896@okhdfcbank',
    supportedOrderTypes: [
      { id: 'dine_in', label: 'Dine In', description: 'At our café tables' },
      { id: 'takeaway', label: 'Takeaway', description: 'Grab & go counter pickup' },
      { id: 'pickup', label: 'Curbside Pickup', description: 'Ready when you arrive' },
      { id: 'delivery', label: 'Delivery', description: 'Direct to your doorstep' },
    ],
    supportedPaymentMethods: [
      { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm, BHIM' },
      { id: 'card', label: 'Credit / Debit Card', description: 'Visa, MasterCard, RuPay' },
      { id: 'cash_on_pickup', label: 'Cash on Pickup', description: 'Pay at café counter' },
    ],
  },
  hours: {
    weekdays: '07:30 AM — 10:30 PM',
    weekends: '07:00 AM — 11:30 PM',
  },
};
