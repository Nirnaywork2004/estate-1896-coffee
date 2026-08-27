import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CustomerReview } from '../../types/reviews.types';
import { reviewsService } from '../../services/reviews.service';
import { Star, ThumbsUp, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [productName, setProductName] = useState('Chikmagalur Heritage Washed V60');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reviewsService.getReviews().then((data) => setReviews(data));
  }, []);

  const handleHelpful = (id: string) => {
    reviewsService.markHelpful(id);
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await reviewsService.addReview({
        authorName: authorName.trim(),
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        productName,
        tastingNotes: ['Artisanal Roast', 'Estate Single-Origin'],
      });

      setReviews((prev) => [created, ...prev]);
      setIsWriteModalOpen(false);
      setAuthorName('');
      setTitle('');
      setComment('');
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative py-24 sm:py-32 bg-espresso-950 text-cream-100 border-t border-roast-800/80 overflow-hidden"
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-roast-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="caramel" size="sm">
                <Sparkles className="w-3 h-3 text-caramel-400" />
                Guest Impressions
              </Badge>
              <span className="text-xs font-mono uppercase tracking-widest text-cream-400">
                Bengaluru Coffee Community
              </span>
            </div>
            <h2
              id="reviews-heading"
              className="font-serif text-fluid-h1 font-bold text-cream-50 tracking-tight"
            >
              Words from Our Patrons
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Overall Rating Pill */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-roast-900/60 border border-roast-800">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs font-mono">
                <span className="font-bold text-cream-50 text-sm">4.9</span> / 5.0 ·{' '}
                <span className="text-cream-400">420+ Reviews</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsWriteModalOpen(true)}
              className="text-xs"
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors border cursor-pointer',
              filterRating === 'all'
                ? 'bg-caramel-500 text-espresso-950 border-caramel-400 font-bold'
                : 'bg-espresso-900/60 text-cream-400 border-roast-800 hover:text-cream-200'
            )}
          >
            All Reviews ({reviews.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterRating(5)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors border cursor-pointer',
              filterRating === 5
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                : 'bg-espresso-900/60 text-cream-400 border-roast-800 hover:text-amber-300'
            )}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>5 Stars Only</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <Card
              key={rev.id}
              variant="default"
              className="p-6 bg-espresso-900/40 border-roast-800 hover:border-roast-700/80 transition-colors flex flex-col justify-between space-y-4 rounded-xl shadow-warm-sm"
            >
              <div className="space-y-3">
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-cream-50 text-base">
                        {rev.authorName}
                      </span>
                      {rev.isVerifiedGuest && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Patron
                        </span>
                      )}
                    </div>
                    {rev.productName && (
                      <span className="text-[11px] font-mono text-copper-300 block mt-0.5">
                        Tasted: {rev.productName}
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center text-amber-400 shrink-0">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                {rev.title && (
                  <h4 className="font-serif text-sm font-semibold text-cream-100">
                    "{rev.title}"
                  </h4>
                )}
                <p className="font-sans text-xs sm:text-sm text-cream-300 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Flavor Tag Pills */}
                {rev.tastingNotes && rev.tastingNotes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2 py-0.5 rounded bg-roast-900 border border-roast-800 text-[10px] font-mono text-caramel-300"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Bottom Bar */}
              <div className="pt-3 border-t border-roast-800/80 flex items-center justify-between text-xs font-mono text-cream-400">
                <span>
                  {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1 text-cream-400 hover:text-caramel-300 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Write a Review"
            className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <div className="fixed inset-0" onClick={() => setIsWriteModalOpen(false)} aria-hidden="true" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-gradient-to-b from-roast-900 to-espresso-950 border border-roast-700 rounded-2xl p-6 space-y-6 shadow-warm-lg"
            >
              <div className="flex items-center justify-between pb-4 border-b border-roast-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-copper-400">
                    Community Feedback
                  </span>
                  <h3 className="font-serif text-xl font-bold text-cream-50">Share Your Roastery Experience</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className={cn(
                    'p-2 rounded-full text-cream-300 hover:text-cream-50 hover:bg-roast-800 transition-colors',
                    FOCUS_RING_CLASSES
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Picker */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={cn(
                            'w-6 h-6',
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-roast-700'
                          )}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-cream-300 ml-2">{rating} of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="rev-name" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Your Name *
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div>
                  <label htmlFor="rev-drink" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Which Offering Did You Enjoy?
                  </label>
                  <select
                    id="rev-drink"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  >
                    <option value="Chikmagalur Heritage Washed V60">Chikmagalur Heritage Washed V60</option>
                    <option value="Monsooned Malabar Reserve Cortado">Monsooned Malabar Reserve Cortado</option>
                    <option value="Wild Jaggery & Cinnamon Smoked Latte">Wild Jaggery & Cinnamon Smoked Latte</option>
                    <option value="Kyoto 24-Hour Cold Drip">Kyoto 24-Hour Cold Drip</option>
                    <option value="Twice-Baked Almond Sourdough Croissant">Twice-Baked Almond Sourdough Croissant</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rev-comment" className="text-xs font-mono uppercase tracking-wider text-cream-300 block mb-1">
                    Your Tasting Impression *
                  </label>
                  <textarea
                    id="rev-comment"
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the aroma, extraction body, flavor notes, or roastery atmosphere..."
                    className="w-full p-2.5 bg-espresso-950 border border-roast-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWriteModalOpen(false)}
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
                    Publish Review
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
