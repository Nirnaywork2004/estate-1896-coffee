import { IndianAddress, IndianState } from '../types/india.types';

/**
 * India-First Address Formatting & Validation Utilities
 */

export const INDIAN_STATES: IndianState[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
  'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
];

/**
 * Validates a 6-digit Indian postal PIN code
 * (PIN codes in India are 6 digits and do not start with 0)
 */
export function isValidPincode(pincode: string): boolean {
  const cleaned = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Formats an Indian address object into a single coherent editorial address string
 */
export function formatAddress(address: Partial<IndianAddress>): string {
  const parts: string[] = [];

  if (address.buildingOrHouse) parts.push(address.buildingOrHouse);
  if (address.street) parts.push(address.street);
  if (address.locality) parts.push(address.locality);
  if (address.landmark) parts.push(`Near ${address.landmark}`);
  if (address.city) parts.push(address.city);
  if (address.state && address.pincode) {
    parts.push(`${address.state} - ${address.pincode}`);
  } else if (address.state) {
    parts.push(address.state);
  } else if (address.pincode) {
    parts.push(`PIN ${address.pincode}`);
  }

  return parts.join(', ');
}
