import React, { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { MoreThanCoffeeSection } from '../sections/MoreThanCoffeeSection';
import { TheCraftSection } from '../sections/TheCraftSection';
import { CoffeeCollectionSection } from '../sections/CoffeeCollectionSection';
import { SignatureDrinksSection } from '../sections/SignatureDrinksSection';
import { BakesPreviewSection } from '../sections/BakesPreviewSection';
import { MenuSection } from '../sections/MenuSection';
import { TastingNotesWall } from '../components/reviews/TastingNotesWall';
import { ReviewsSection } from '../components/reviews/ReviewsSection';
import { ReservationSection } from '../components/reservations/ReservationSection';
import { RoasteryLocationSection } from '../components/location/RoasteryLocationSection';
import { FindYourCupCTASection } from '../sections/FindYourCupCTASection';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { CheckoutModal } from '../components/checkout/CheckoutModal';
import { OrderHistoryModal } from '../components/orders/OrderHistoryModal';
import { FoundationPreview } from './FoundationPreview';
import { useCart } from '../context/CartContext';
import { Terminal, Eye, EyeOff } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [showFoundationConsole, setShowFoundationConsole] = useState<boolean>(false);
  const { isCheckoutOpen, setIsCheckoutOpen, isHistoryOpen, setIsHistoryOpen } = useCart();

  return (
    <div className="relative min-h-screen bg-espresso-950 text-cream-100 selection:bg-caramel-500 selection:text-espresso-950">
      {/* Primary Fixed Navbar */}
      <Navbar />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Checkout Multi-Step Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Main Cinematic Scrolling Flow */}
      <main id="main-content">
        {/* Phase 2: Hero Section */}
        <HeroSection />

        {/* Phase 3: Section 1 — More Than Coffee */}
        <MoreThanCoffeeSection />

        {/* Phase 3: Section 2 — The Craft Story */}
        <TheCraftSection />

        {/* Phase 3: Section 3 — Coffee Collection / Personalities */}
        <CoffeeCollectionSection />

        {/* Phase 3: Section 4 — Signature Creations */}
        <SignatureDrinksSection />

        {/* Phase 3: Section 5 — Bakes & Kitchen Preview */}
        <BakesPreviewSection />

        {/* Phase 4: Full Interactive Menu Experience */}
        <MenuSection />

        {/* Phase 6: Community Tasting Notes Wall */}
        <TastingNotesWall />

        {/* Phase 6: Customer Reviews & Impressions */}
        <ReviewsSection />

        {/* Phase 6: Table Reservation Module */}
        <ReservationSection />

        {/* Phase 6: Flagship Sanctuary & Roastery Location */}
        <RoasteryLocationSection />

        {/* Phase 3: Section 7 — Find Your Cup Invitation */}
        <FindYourCupCTASection />
      </main>

      {/* Luxury Editorial Footer */}
      <Footer />

      {/* Developer Foundation Verification Console Toggle (Bottom Right Floating Pill) */}
      <aside aria-label="Developer Foundation Console Toggle" className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setShowFoundationConsole(!showFoundationConsole)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-espresso-900/90 border border-roast-700/80 text-cream-300 hover:text-caramel-300 hover:border-caramel-500/60 shadow-warm-lg backdrop-blur-md text-xs font-mono transition-all cursor-pointer"
          title="Toggle Phase 1 Foundation & Supabase Health Console"
        >
          <Terminal className="w-3.5 h-3.5 text-caramel-400" />
          <span>{showFoundationConsole ? 'Hide System Console' : 'System Console'}</span>
          {showFoundationConsole ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </aside>

      {/* Developer Foundation Console Overlay Modal */}
      {showFoundationConsole && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Estate 1896 System Console"
          className="fixed inset-0 z-50 bg-espresso-950/95 backdrop-blur-xl overflow-y-auto p-4 sm:p-8"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-roast-700">
              <div className="flex items-center gap-2 text-xs font-mono text-caramel-400 uppercase">
                <Terminal className="w-4 h-4" />
                <span>Phase 1 Architecture & Supabase Diagnostic Dashboard</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFoundationConsole(false)}
                className="px-4 py-1.5 bg-roast-800 hover:bg-roast-700 text-cream-100 rounded text-xs font-mono border border-roast-600 transition-colors"
              >
                Close Diagnostic Console ✕
              </button>
            </div>
            <FoundationPreview />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
