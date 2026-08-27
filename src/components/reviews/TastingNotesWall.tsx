import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TastingObservation, FlavorCategory } from '../../types/reviews.types';
import { reviewsService } from '../../services/reviews.service';
import { Heart, Plus, X, Coffee, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

const FLAVOR_CATEGORIES: FlavorCategory[] = [
  'Chocolate',
  'Caramel',
  'Nutty',
  'Fruity',
  'Floral',
  'Spicy',
  'Citrus',
  'Roasted',
  'Sweet',
];

export const TastingNotesWall: React.FC = () => {
  const [observations, setObservations] = useState<TastingObservation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategory | 'all'>('all');
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  // Contributor form state
  const [coffeeName, setCoffeeName] = useState('Chikmagalur Heritage Washed V60');
  const [contributorName, setContributorName] = useState('');
  const [category, setCategory] = useState<FlavorCategory>('Floral');
  const [specificNoteInput, setSpecificNoteInput] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reviewsService.getTastingObservations().then((data) => setObservations(data));
  }, []);

  const handleLike = (id: string) => {
    reviewsService.likeTastingObservation(id);
    setObservations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, likesCount: o.likesCount + 1 } : o))
    );
  };

  const handleAddObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName.trim() || !noteText.trim()) return;

    setIsSubmitting(true);
    try {
      const parsedNotes = specificNoteInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await reviewsService.addTastingObservation({
        coffeeName,
        contributorName: contributorName.trim(),
        flavorCategory: category,
        specificNotes: parsedNotes.length > 0 ? parsedNotes : [category],
        noteText: noteText.trim(),
      });

      setObservations((prev) => [created, ...prev]);
      setIsContributeModalOpen(false);
      setContributorName('');
      setSpecificNoteInput('');
      setNoteText('');
    } catch (err) {
      console.error('Failed to submit tasting note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredObservations = observations.filter((o) => {
    if (selectedCategory === 'all') return true;
    return o.flavorCategory === selectedCategory;
  });

  return (
    <section
      id="tasting-wall"
      aria-labelledby="tasting-wall-heading"
      className="relative py-24 sm:py-32 bg-roast-900/30 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-roast-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="copper" size="sm">
                <Compass className="w-3 h-3 text-copper-400" />
                Community Palate
              </Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                Sensory Observations
              </span>
            </div>
            <h2
              id="tasting-wall-heading"
              className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
            >
              The Sensory Tasting Wall
            </h2>
            <p className="text-xs sm:text-sm text-cream-300 font-sans max-w-xl">
              Coffee is an evolving conversation. Read tasting impressions from guests and roasters, or contribute your own aromatic discoveries.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsContributeModalOpen(true)}
            className="text-xs hover:border-caramel-400"
          >
            Add Tasting Observation
          </Button>
        </div>

        {/* Sensory Category Filter Pills */}
        <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors border cursor-pointer shrink-0',
              selectedCategory === 'all'
                ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold'
                : 'bg-espresso-900/60 text-cream-400 border-roast-800 hover:text-cream-200'
            )}
          >
            All Notes ({observations.length})
          </button>

          {FLAVOR_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = observations.filter((o) => o.flavorCategory === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors border cursor-pointer shrink-0 flex items-center gap-1.5',
                  isSelected
                    ? 'bg-copper-500 text-cream-50 border-copper-400 font-bold'
                    : 'bg-espresso-950/60 text-cream-400 border-roast-800 hover:text-cream-200'
                )}
              >
                <span>{cat}</span>
                {count > 0 && <span className="text-[10px] text-cream-400">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Sensory Cards Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredObservations.map((obs) => (
            <Card
              key={obs.id}
              variant="default"
              className="p-5 sm:p-6 bg-espresso-950/70 border-roast-800 hover:border-caramel-500/50 transition-all flex flex-col justify-between space-y-4 rounded-xl shadow-warm-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-roast-900 border border-roast-700 text-[10px] uppercase font-mono tracking-wider text-caramel-300 font-semibold">
                    {obs.flavorCategory}
                  </span>
                  <span className="text-[10px] font-mono text-cream-400">
                    by {obs.contributorName}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-cream-100 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-copper-400" />
                  {obs.coffeeName}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-cream-200/90 leading-relaxed italic">
                  “{obs.noteText}”
                </p>

                {/* Specific Flavor Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {obs.specificNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2 py-0.5 rounded bg-espresso-900 border border-roast-800 text-[10px] font-mono text-copper-300"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Bar */}
              <div className="pt-3 border-t border-roast-800/80 flex items-center justify-between text-xs font-mono text-cream-400">
                <span>
                  {new Date(obs.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>

                <button
                  type="button"
                  onClick={() => handleLike(obs.id)}
                  className="flex items-center gap-1.5 text-cream-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-red-500/20 text-red-400" />
                  <span>{obs.likesCount}</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* Contribute Tasting Note Modal */}
      <AnimatePresence>
        {isContributeModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contribute Tasting Note"
            className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <div className="fixed inset-0" onClick={() => setIsContributeModalOpen(false)} aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-gradient-to-b from-roast-900 to-espresso-950 border border-roast-700 rounded-2xl p-6 space-y-6 shadow-warm-lg"
            >
              <div className="flex items-center justify-between pb-4 border-b border-roast-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400">
                    Community Wall Contribution
                  </span>
                  <h3 className="font-serif text-xl font-bold text-cream-50">Share a Tasting Note</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContributeModalOpen(false)}
                  className={cn(
                    'p-2 rounded-full text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors',
                    FOCUS_RING_CLASSES
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddObservation} className="space-y-4">
                <div>
                  <label htmlFor="coffee-select" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Select Roastery Offering
                  </label>
                  <select
                    id="coffee-select"
                    value={coffeeName}
                    onChange={(e) => setCoffeeName(e.target.value)}
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  >
                    <option value="Chikmagalur Heritage Washed V60">Chikmagalur Heritage Washed V60</option>
                    <option value="Monsooned Malabar Reserve Cortado">Monsooned Malabar Reserve Cortado</option>
                    <option value="Wild Jaggery & Cinnamon Smoked Latte">Wild Jaggery & Cinnamon Smoked Latte</option>
                    <option value="Kyoto 24-Hour Cold Drip">Kyoto 24-Hour Cold Drip</option>
                    <option value="Shevaroy Hills Flat White">Shevaroy Hills Flat White</option>
                    <option value="Mysore AAA Double Ristretto">Mysore AAA Double Ristretto</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contributor-name" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contributor-name"
                    type="text"
                    required
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="e.g. Siddharth R."
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div>
                  <label htmlFor="category-select" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Primary Flavor Group
                  </label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FlavorCategory)}
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  >
                    {FLAVOR_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="specific-notes" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Specific Aromatic Descriptors (Comma-separated)
                  </label>
                  <input
                    id="specific-notes"
                    type="text"
                    value={specificNoteInput}
                    onChange={(e) => setSpecificNoteInput(e.target.value)}
                    placeholder="e.g. Orange Blossom, Wild Honey, Meyer Lemon"
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div>
                  <label htmlFor="tasting-note" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Your Observation / Note *
                  </label>
                  <textarea
                    id="tasting-note"
                    required
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Describe how the acidity, sweetness, and aftertaste unfolded on your palate..."
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsContributeModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    isLoading={isSubmitting}
                    className="text-xs font-bold"
                  >
                    Publish to Wall
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
