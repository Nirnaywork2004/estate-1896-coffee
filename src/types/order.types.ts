import { OrderType, PaymentMethod, PaymentStatus, OrderStatus } from './database.types';
import { IndianAddress } from './india.types';
import { CartLineItem } from './menu.types';

export type CheckoutStep = 'cart' | 'order_type' | 'customer_details' | 'payment' | 'review' | 'confirmation';

export interface PickupDetails {
  slot: 'asap' | 'scheduled';
  scheduledTime?: string; // e.g. "Today, 04:30 PM"
}

export interface DineInDetails {
  tableNumber: string; // e.g. "Table 4" or "Bar Counter 2"
}

export interface CustomerContact {
  fullName: string;
  phone: string; // Indian mobile (+91)
  email: string;
  notes?: string;
}

export interface AppliedDiscount {
  code: string;
  discountAmount: number;
  description: string;
}

export interface CheckoutPayload {
  orderType: OrderType;
  dineIn?: DineInDetails;
  pickup?: PickupDetails;
  deliveryAddress?: IndianAddress;
  customer: CustomerContact;
  paymentMethod: PaymentMethod;
  upiId?: string;
  discount?: AppliedDiscount;
  items: CartLineItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customer: CustomerContact;
  dineIn?: DineInDetails;
  pickup?: PickupDetails;
  deliveryAddress?: IndianAddress;
  items: CartLineItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  estimatedTimeMinutes: number;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}
