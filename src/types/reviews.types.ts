export interface CustomerReview {
  id: string;
  authorName: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  productName?: string;
  tastingNotes?: string[];
  helpfulCount: number;
  createdAt: string;
  isVerifiedGuest?: boolean;
}

export type FlavorCategory =
  | 'Chocolate'
  | 'Caramel'
  | 'Nutty'
  | 'Fruity'
  | 'Floral'
  | 'Spicy'
  | 'Citrus'
  | 'Roasted'
  | 'Sweet';

export interface TastingObservation {
  id: string;
  coffeeName: string;
  contributorName: string;
  flavorCategory: FlavorCategory;
  specificNotes: string[];
  noteText: string;
  likesCount: number;
  createdAt: string;
}

export type SeatingPreference =
  | 'indoor_villa'
  | 'garden_patio'
  | 'brew_bar'
  | 'window_nook';

export interface TableReservation {
  id: string;
  reservationNumber: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCount: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // e.g. "10:30 AM"
  seatingPreference: SeatingPreference;
  specialRequests?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: string;
}
