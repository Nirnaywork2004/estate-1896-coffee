import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X, ArrowRight, Coffee, ShoppingBag, Clock, Calendar } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';
import { useCart } from '../../context/CartContext';
import { ordersService } from '../../services/orders.service';

interface NavItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Our Coffee', href: '#craft-transition' },
  { label: 'Menu', href: '#menu' },
  { label: 'Tasting Wall', href: '#tasting-wall' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Sanctuary', href: '#location' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsCartOpen, setIsHistoryOpen } = useCart();
  const [orderCount, setOrderCount] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Check order count
    try {
      const history = ordersService.getLocalOrderHistory();
      setOrderCount(history.length);
    } catch (e) {
      // ignore
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isScrolled
            ? 'bg-espresso-950/90 backdrop-blur-md py-3.5 border-b border-roast-700/60 shadow-warm-md'
            : 'bg-gradient-to-b from-espresso-950/80 via-espresso-950/30 to-transparent py-5 sm:py-6'
        )}
      >
        <Container size="xl">
          <nav className="flex items-center justify-between" aria-label="Main Navigation">
            {/* Brand Logo */}
            <a
              href="#hero"
              className={cn(
                'group flex items-center gap-2.5 text-cream-50 transition-colors',
                FOCUS_RING_CLASSES
              )}
            >
              <div className="w-8 h-8 rounded-full bg-roast-800 border border-caramel-500/40 flex items-center justify-center text-caramel-400 group-hover:border-caramel-400 group-hover:text-caramel-300 transition-colors">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-cinematic text-cream-50 uppercase group-hover:text-caramel-300 transition-colors">
                  ESTATE 1896
                </span>
                <span className="text-[9px] uppercase tracking-superwide text-copper-400 font-mono -mt-1">
                  Artisanal Roastery
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-xs font-medium tracking-editorial uppercase transition-all duration-200 text-cream-200 hover:text-caramel-400 relative py-1',
                    'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-caramel-500 after:transition-all after:duration-300 hover:after:w-full',
                    FOCUS_RING_CLASSES
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Table Booking Quick Link */}
              <button
                type="button"
                onClick={() => scrollToSection('reservations')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full bg-espresso-900/80 border border-roast-700/80 text-cream-300 hover:text-caramel-300 hover:border-caramel-500/60 text-xs font-mono transition-colors cursor-pointer',
                  FOCUS_RING_CLASSES
                )}
                title="Reserve a Table at Indiranagar Roastery"
              >
                <Calendar className="w-3.5 h-3.5 text-copper-400" />
                <span>Book Table</span>
              </button>

              {/* Order History Trigger */}
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full bg-roast-900/60 border border-roast-700/80 text-cream-300 hover:text-caramel-300 hover:border-caramel-500/60 text-xs font-mono transition-colors cursor-pointer',
                  FOCUS_RING_CLASSES
                )}
                title="View Past Orders & Status"
              >
                <Clock className="w-3.5 h-3.5 text-caramel-400" />
                <span>Orders</span>
                {orderCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-caramel-500 text-espresso-950 text-[10px] font-bold">
                    {orderCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className={cn(
                  'relative p-2.5 rounded-full bg-roast-900/80 border border-roast-700/80 text-cream-200 hover:text-caramel-300 hover:border-caramel-500/60 transition-colors cursor-pointer',
                  FOCUS_RING_CLASSES
                )}
                aria-label={`View order (${totalItemsCount} items)`}
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-caramel-500 text-espresso-950 text-[10px] font-mono font-bold flex items-center justify-center shadow-warm-sm animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <Button
                variant="primary"
                size="sm"
                className="group"
                rightIcon={
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                }
                onClick={() => scrollToSection('menu')}
              >
                Order Coffee
              </Button>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 rounded-sm text-cream-300 hover:text-caramel-400"
                aria-label="Order history"
              >
                <Clock className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-sm text-cream-200 hover:text-caramel-400"
                aria-label="View order"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute 0 top-0 right-0 w-4 h-4 rounded-full bg-caramel-500 text-espresso-950 text-[9px] font-mono font-bold flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={cn(
                  'p-2 rounded-sm text-cream-200 hover:text-caramel-400 hover:bg-roast-800/80 transition-colors',
                  FOCUS_RING_CLASSES
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-espresso-950/98 backdrop-blur-xl md:hidden flex flex-col justify-between pt-24 pb-12 px-6"
          >
            <nav className="flex flex-col space-y-5 text-center mt-4">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * idx, duration: 0.3 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-xl tracking-wide text-cream-100 hover:text-caramel-400 transition-colors py-1"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="space-y-3 text-center">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center text-xs"
                leftIcon={<Calendar className="w-4 h-4 text-copper-400" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('reservations');
                }}
              >
                Book a Table
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center text-xs"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('menu');
                }}
              >
                Order Coffee
              </Button>
              <p className="text-[10px] text-cream-400 font-mono tracking-wider uppercase pt-2">
                100ft Road · Indiranagar · Bengaluru
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
