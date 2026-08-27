/**
 * India-First Phone Number Utilities (+91)
 */

/**
 * Validates whether the input is a valid 10-digit Indian mobile number
 * (Starts with 6, 7, 8, or 9)
 */
export function isValidIndianMobile(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return /^[6-9]\d{9}$/.test(cleaned);
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return /^91[6-9]\d{9}$/.test(cleaned);
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return /^0[6-9]\d{9}$/.test(cleaned);
  }

  return false;
}

/**
 * Normalizes any phone input into a standard 10-digit number
 */
export function normalizeIndianPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Formats a phone number for display as: +91 98450 18960
 */
export function formatIndianPhone(phone: string): string {
  const raw = normalizeIndianPhone(phone);
  if (raw.length !== 10) {
    return phone;
  }
  return `+91 ${raw.slice(0, 5)} ${raw.slice(5)}`;
}

/**
 * Returns phone in international format for WhatsApp / tel links: 919845018960
 */
export function getWhatsAppPhone(phone: string): string {
  const raw = normalizeIndianPhone(phone);
  return `91${raw}`;
}
