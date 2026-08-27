import { AppliedDiscount } from '../types/order.types';

export interface PromoRule {
  code: string;
  type: 'percentage' | 'flat';
  value: number; // percentage or flat amount in ₹
  minSubtotal: number;
  description: string;
}

export const VALID_PROMO_CODES: Record<string, PromoRule> = {
  ESTATE10: {
    code: 'ESTATE10',
    type: 'percentage',
    value: 10,
    minSubtotal: 200,
    description: '10% off on artisanal coffee & bakery orders over ₹200',
  },
  FIRSTBREW: {
    code: 'FIRSTBREW',
    type: 'flat',
    value: 50,
    minSubtotal: 250,
    description: 'Flat ₹50 off your first roastery order over ₹250',
  },
  ARABICA20: {
    code: 'ARABICA20',
    type: 'percentage',
    value: 20,
    minSubtotal: 600,
    description: '20% off on specialty orders over ₹600',
  },
};

export function validatePromoCode(
  code: string,
  subtotal: number
): { discount: AppliedDiscount | null; error: string | null } {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return { discount: null, error: 'Please enter a coupon code.' };
  }

  const rule = VALID_PROMO_CODES[normalized];

  if (!rule) {
    return { discount: null, error: 'Invalid coupon code. Try ESTATE10 or FIRSTBREW.' };
  }

  if (subtotal < rule.minSubtotal) {
    return {
      discount: null,
      error: `Coupon requires a minimum order of ₹${rule.minSubtotal}.`,
    };
  }

  let discountAmount = 0;
  if (rule.type === 'percentage') {
    discountAmount = Math.round((subtotal * rule.value) / 100);
  } else {
    discountAmount = rule.value;
  }

  return {
    discount: {
      code: rule.code,
      discountAmount,
      description: rule.description,
    },
    error: null,
  };
}
