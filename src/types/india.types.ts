/**
 * India-First Architecture Type Definitions
 */

export interface IndianAddress {
  buildingOrHouse?: string;
  street: string;
  landmark?: string;
  locality?: string;
  city: string;
  state: IndianState;
  pincode: string; // 6-digit postal code
  country: 'India';
}

export type IndianState =
  | 'Andhra Pradesh'
  | 'Arunachal Pradesh'
  | 'Assam'
  | 'Bihar'
  | 'Chhattisgarh'
  | 'Goa'
  | 'Gujarat'
  | 'Haryana'
  | 'Himachal Pradesh'
  | 'Jharkhand'
  | 'Karnataka'
  | 'Kerala'
  | 'Madhya Pradesh'
  | 'Maharashtra'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Odisha'
  | 'Punjab'
  | 'Rajasthan'
  | 'Sikkim'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Tripura'
  | 'Uttar Pradesh'
  | 'Uttarakhand'
  | 'West Bengal'
  | 'Delhi'
  | 'Jammu and Kashmir'
  | 'Ladakh'
  | 'Puducherry'
  | 'Chandigarh'
  | 'Andaman and Nicobar Islands'
  | 'Dadra and Nagar Haveli and Daman and Diu'
  | 'Lakshadweep';

export interface UPIPaymentDetails {
  upiId: string;
  payeeName: string;
  transactionRef?: string;
  amount: number;
  currency: 'INR';
  note?: string;
}

export interface GSTDetails {
  gstin?: string;
  fssaiNumber?: string;
  cgstRate: number; // e.g. 2.5%
  sgstRate: number; // e.g. 2.5%
  totalTaxRate: number; // e.g. 5.0%
}
