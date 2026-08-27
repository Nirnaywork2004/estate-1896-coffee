import { Category } from '../types/product.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Single Origin Pour-Overs',
    slug: 'single-origin-pour-overs',
    description: 'Hand-poured filter brews highlighting micro-lot estates of Chikmagalur, Coorg, and Araku Valley.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Artisanal Espresso',
    slug: 'artisanal-espresso',
    description: 'Precision-extracted 9-bar espresso drinks calibrated daily for sweetness and silky texture.',
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Cold Craft & Nitro',
    slug: 'cold-craft-nitro',
    description: '24-hour slow-dripped iced coffees, nitro draughts, and refreshing botanical infusions.',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Signature Café Drinks',
    slug: 'signature-cafe-drinks',
    description: 'House-crafted signatures combining Indian botanicals, wild jaggery, and single-origin beans.',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Fresh Bakes & Kitchen',
    slug: 'fresh-bakes-kitchen',
    description: 'Freshly laminated sourdough pastries, tea cakes, and savory breakfast toasts.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 5,
    isActive: true,
  },
];
