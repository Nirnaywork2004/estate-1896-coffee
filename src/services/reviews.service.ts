import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/env';
import { CustomerReview, TastingObservation } from '../types/reviews.types';

const REVIEWS_STORAGE_KEY = 'estate1896_reviews_v1';
const TASTING_STORAGE_KEY = 'estate1896_tasting_notes_v1';

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'Rohan Mehra',
    rating: 5,
    title: 'The Monsooned Malabar Cortado is exceptional',
    comment:
      'Estate 1896 is hands-down Bengaluru’s premier specialty sanctuary. The 16-week oceanic cured Malabar beans have practically zero acidity and a rich dark cacao depth. Paired with their almond croissant, it’s unbeatable.',
    productName: 'Monsooned Malabar Reserve Cortado',
    tastingNotes: ['Baker’s Chocolate', 'Toasted Walnut', 'Cardamom'],
    helpfulCount: 42,
    createdAt: '2026-08-20T10:30:00Z',
    isVerifiedGuest: true,
  },
  {
    id: 'rev-2',
    authorName: 'Ananya Deshmukh',
    rating: 5,
    title: 'Unbelievable Wild Jaggery Latte',
    comment:
      'The raw palm jaggery melted under the espresso stream creates this subtle caramelized molasses note that works so smoothly with oat milk. The atmosphere in the restored Indiranagar villa makes you want to read here all day.',
    productName: 'Wild Jaggery & Cinnamon Smoked Latte',
    tastingNotes: ['Palm Jaggery', 'Ceylon Cinnamon', 'Brown Butter'],
    helpfulCount: 38,
    createdAt: '2026-08-22T14:15:00Z',
    isVerifiedGuest: true,
  },
  {
    id: 'rev-3',
    authorName: 'Vikramaditya Rao',
    rating: 5,
    title: 'Precision extraction & slow brew bar perfection',
    comment:
      'Sat at the slow brew bar watching the barista dial in a washed Chikmagalur V60 at 93°C. The jasmine florals and peach sweetness were crystal clear. This is true third-wave craftsmanship done right in India.',
    productName: 'Chikmagalur Heritage Washed V60',
    tastingNotes: ['Jasmine Florals', 'Meyer Lemon', 'Wild Honey'],
    helpfulCount: 29,
    createdAt: '2026-08-24T09:00:00Z',
    isVerifiedGuest: true,
  },
  {
    id: 'rev-4',
    authorName: 'Pooja Sundaram',
    rating: 5,
    title: 'Artisanal sourdough bakes & Kyoto cold brew',
    comment:
      'The 24-hour slow ice drip cold brew has an astonishing liqueur-like mouthfeel with natural blueberry acidity. Combined with the twice-baked almond croissant, this is world-class.',
    productName: 'Kyoto 24-Hour Cold Drip',
    tastingNotes: ['Blueberry', 'Cacao Nibs', 'Maple'],
    helpfulCount: 21,
    createdAt: '2026-08-25T16:40:00Z',
    isVerifiedGuest: true,
  },
];

export const INITIAL_TASTING_OBSERVATIONS: TastingObservation[] = [
  {
    id: 'taste-1',
    coffeeName: 'Chikmagalur Washed V60',
    contributorName: 'Priya K.',
    flavorCategory: 'Floral',
    specificNotes: ['Night Jasmine', 'Orange Blossom', 'White Tea'],
    noteText: 'Extracted at 93°C, the first sip is pure jasmine floral aromatics before settling into a sweet honeyed tea body.',
    likesCount: 56,
    createdAt: '2026-08-23T11:00:00Z',
  },
  {
    id: 'taste-2',
    coffeeName: 'Monsooned Malabar Cortado',
    contributorName: 'Devansh S.',
    flavorCategory: 'Spicy',
    specificNotes: ['Cardamom Smoke', 'Toasted Walnut', 'Nutmeg'],
    noteText: 'Dense and comforting with warm baking spices. The oceanic monsoon wind curing completely rounds off the sharp acidity.',
    likesCount: 48,
    createdAt: '2026-08-24T15:20:00Z',
  },
  {
    id: 'taste-3',
    coffeeName: 'Kyoto 24-Hour Cold Drip',
    contributorName: 'Kavita M.',
    flavorCategory: 'Fruity',
    specificNotes: ['Wild Blueberry', 'Blackcurrant', 'Meyer Lemon'],
    noteText: 'Bright and jammy berry notes shine through the crystal ice sphere. Zero bitterness with a velvety liqueur-like finish.',
    likesCount: 63,
    createdAt: '2026-08-25T18:00:00Z',
  },
  {
    id: 'taste-4',
    coffeeName: 'Mysore AAA Ristretto',
    contributorName: 'Arjun N.',
    flavorCategory: 'Chocolate',
    specificNotes: ['Dark Cocoa', 'Black Molasses', 'Cacao Nibs'],
    noteText: 'Intense, heavy 1:1.5 extraction ratio. Lingering 75% dark chocolate bitterness that balances beautifully with a splash of milk.',
    likesCount: 39,
    createdAt: '2026-08-26T08:45:00Z',
  },
  {
    id: 'taste-5',
    coffeeName: 'Shevaroy Hills Flat White',
    contributorName: 'Sneha B.',
    flavorCategory: 'Caramel',
    specificNotes: ['Caramelized Brown Sugar', 'Toasted Almond', 'Nougat'],
    noteText: 'Steamed to exactly 62°C, the dairy lactose natural sweetness marries the caramelized nuttiness of the medium roast.',
    likesCount: 44,
    createdAt: '2026-08-26T12:30:00Z',
  },
];

export const reviewsService = {
  /**
   * Get all reviews from local storage or database
   */
  async getReviews(): Promise<CustomerReview[]> {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load local reviews:', e);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from('reviews') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          const mapped: CustomerReview[] = data.map((r: any) => ({
            id: r.id,
            authorName: r.author_name,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            productName: 'Specialty Roastery Offering',
            tastingNotes: ['Artisanal Specialty'],
            helpfulCount: 5,
            createdAt: r.created_at,
            isVerifiedGuest: true,
          }));
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch reviews warning:', err);
      }
    }

    return INITIAL_REVIEWS;
  },

  /**
   * Add a new customer review
   */
  async addReview(
    review: Omit<CustomerReview, 'id' | 'createdAt' | 'helpfulCount'>
  ): Promise<CustomerReview> {
    const newReview: CustomerReview = {
      ...review,
      id: `rev_${Date.now()}`,
      helpfulCount: 1,
      createdAt: new Date().toISOString(),
      isVerifiedGuest: true,
    };

    // Save locally
    try {
      const current = await this.getReviews();
      const updated = [newReview, ...current];
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update local reviews:', e);
    }

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      try {
        await (supabase.from('reviews') as any).insert({
          author_name: review.authorName,
          rating: review.rating,
          title: review.title || null,
          comment: review.comment,
          is_published: true,
        });
      } catch (err) {
        console.warn('Supabase review insert warning:', err);
      }
    }

    return newReview;
  },

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string) {
    try {
      const current = await this.getReviews();
      const updated = current.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      );
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update helpful count:', e);
    }
  },

  /**
   * Get all tasting observations
   */
  async getTastingObservations(): Promise<TastingObservation[]> {
    try {
      const saved = localStorage.getItem(TASTING_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load tasting observations:', e);
    }
    return INITIAL_TASTING_OBSERVATIONS;
  },

  /**
   * Add a new community tasting observation
   */
  async addTastingObservation(
    obs: Omit<TastingObservation, 'id' | 'createdAt' | 'likesCount'>
  ): Promise<TastingObservation> {
    const newObs: TastingObservation = {
      ...obs,
      id: `taste_${Date.now()}`,
      likesCount: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      const current = await this.getTastingObservations();
      const updated = [newObs, ...current];
      localStorage.setItem(TASTING_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save tasting observation:', e);
    }

    if (isSupabaseConfigured()) {
      try {
        await (supabase.from('tasting_notes') as any).insert({
          coffee_name: obs.coffeeName,
          contributor_name: obs.contributorName,
          flavor_tags: obs.specificNotes,
          note_text: obs.noteText,
          likes_count: 1,
        });
      } catch (err) {
        console.warn('Supabase tasting note insert warning:', err);
      }
    }

    return newObs;
  },

  /**
   * Like a tasting observation
   */
  async likeTastingObservation(id: string) {
    try {
      const current = await this.getTastingObservations();
      const updated = current.map((t) =>
        t.id === id ? { ...t, likesCount: t.likesCount + 1 } : t
      );
      localStorage.setItem(TASTING_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to like tasting note:', e);
    }
  },
};
