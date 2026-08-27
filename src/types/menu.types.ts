export type MenuCategorySlug = 'all' | 'coffee' | 'non-coffee' | 'food' | 'desserts' | 'signatures';

export type CoffeeSize = 'Small (240ml)' | 'Medium (350ml)' | 'Large (450ml)';
export type MilkType = 'Regular Whole Dairy' | 'Farm Full Cream (+₹15)' | 'Minor Figures Oat Milk (+₹45)' | 'Roasted Almond Milk (+₹45)' | 'Organic Soy Milk (+₹35)' | 'No Milk (Black)';
export type SweetnessLevel = 'No Sugar' | 'Less Sweet (25%)' | 'Regular (50%)' | 'Extra Sweet (100%)';
export type DrinkTemp = 'Hot' | 'Iced';
export type GrindType = 'Whole Beans' | 'Espresso (Fine)' | 'Pour-Over / Aeropress (Medium)' | 'French Press (Coarse)';

export interface ExtraOption {
  id: string;
  name: string;
  price: number; // in ₹ INR
}

export interface MenuItemCustomization {
  sizes?: { name: CoffeeSize; priceDelta: number }[];
  milks?: { name: MilkType; priceDelta: number }[];
  sweetnessLevels?: SweetnessLevel[];
  temperatures?: DrinkTemp[];
  grinds?: GrindType[];
  availableExtras?: ExtraOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategorySlug;
  categoryLabel: string;
  tagline?: string;
  description: string;
  price: number; // Base price in ₹ INR
  image: string;
  isVeg: boolean;
  isVegan?: boolean;
  isSignature?: boolean;
  flavorNotes?: string[];
  originRegion?: string;
  customization?: MenuItemCustomization;
}

export interface SelectedCustomization {
  size?: CoffeeSize;
  sizePriceDelta?: number;
  milk?: MilkType;
  milkPriceDelta?: number;
  sweetness?: SweetnessLevel;
  temperature?: DrinkTemp;
  grind?: GrindType;
  extras: ExtraOption[];
  specialInstructions?: string;
}

export interface CartLineItem {
  id: string; // Unique string hash based on item id + customizations
  menuItem: MenuItem;
  quantity: number;
  customization: SelectedCustomization;
  unitPrice: number; // base + sum(deltas)
  totalPrice: number; // unitPrice * quantity
}
