/**
 * India-First Currency Utilities
 * Formats numbers in Indian Numbering System (Lakhs, Crores) with ₹ INR symbol.
 */

export interface FormatINROptions {
  includeSymbol?: boolean;
  showDecimals?: boolean;
  spaceAfterSymbol?: boolean;
}

/**
 * Format a number into ₹ INR string following the Indian numbering system.
 * e.g., 240 -> "₹240", 12500 -> "₹12,500", 150000 -> "₹1,50,000"
 */
export function formatINR(amount: number, options: FormatINROptions = {}): string {
  const {
    includeSymbol = true,
    showDecimals = false,
    spaceAfterSymbol = true,
  } = options;

  if (isNaN(amount)) {
    return includeSymbol ? (spaceAfterSymbol ? '₹ 0' : '₹0') : '0';
  }

  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  if (!includeSymbol) {
    return formattedNumber;
  }

  return spaceAfterSymbol ? `₹ ${formattedNumber}` : `₹${formattedNumber}`;
}

/**
 * Calculate GST (Goods and Services Tax) breakdown
 * Standard restaurant/café rate in India is 5% (2.5% CGST + 2.5% SGST)
 */
export function calculateGST(subtotal: number, gstRatePercent: number = 5.0) {
  const tax = Number(((subtotal * gstRatePercent) / 100).toFixed(2));
  const cgst = Number((tax / 2).toFixed(2));
  const sgst = Number((tax / 2).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return {
    subtotal,
    gstRatePercent,
    cgst,
    sgst,
    tax,
    total,
  };
}
