import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  // Scroll to transition section smoothly
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('craft-transition');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.18,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.85,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="hero"
      aria-label="Estate 1896 Hero"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-espresso-950"
    >
      {/* Background Image Composition */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <motion.div
          initial={{ scale: prefersReducedMotion ? 1 : 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 1.8, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <img
            src="/images/hero-pour.jpg"
            alt="Silky milk pouring into artisanal dark roast espresso"
            className="w-full h-full object-cover object-center md:object-[center_35%]"
            loading="eager"
            decoding="async"
          />

          {/* Cinematic Multi-layered Atmosphere Gradients */}
          {/* Top subtle vignette for navbar */}
          <div className="absolute inset-0 bg-gradient-to-b from-espresso-950/90 via-transparent to-transparent h-40" />

          {/* Left / Center content backing gradient for pristine legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-espresso-950/95 via-espresso-950/75 to-transparent sm:max-w-[70%] lg:max-w-[60%]" />

          {/* Bottom vignette blending seamlessly into the next section */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/40 to-transparent" />

          {/* Subtle warm amber ambient spotlight */}
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-caramel-500/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center pt-28 sm:pt-32 pb-16">
        <Container size="xl" className="w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5">
              <span className="w-6 sm:w-8 h-[1px] bg-copper-400" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold tracking-cinematic text-copper-300 uppercase font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-caramel-400" />
                ESTATE 1896 · ARTISANAL COFFEE
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif text-fluid-display font-bold text-cream-50 leading-[1.08] tracking-tight text-balance drop-shadow-sm"
            >
              Coffee, crafted as an{' '}
              <span className="italic font-normal text-caramel-300 underline decoration-copper-500/40 decoration-wavy decoration-1 underline-offset-8">
                experience.
              </span>
            </motion.h1>

            {/* Supporting Paragraph */}
            <motion.p
              variants={itemVariants}
              className="font-sans text-fluid-body-lg text-cream-200 leading-relaxed max-w-xl text-balance drop-shadow-sm"
            >
              From carefully selected beans to the final pour, discover coffee made with patience, character and intention.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 sm:pt-4"
            >
              <Button
                variant="primary"
                size="lg"
                className="group"
                rightIcon={
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                }
                onClick={scrollToNextSection}
              >
                Order Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={scrollToNextSection}
                className="hover:border-caramel-400"
              >
                Explore Our Coffee
              </Button>
            </motion.div>

            {/* Single Origin Micro-Badge */}
            <motion.div
              variants={itemVariants}
              className="pt-4 sm:pt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-cream-400 font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel-400" />
                <span>Single-Origin Indian Arabica</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-copper-400" />
                <span>Micro-Lot Harvests</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-300" />
                <span>Shade-Grown Canopy</span>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>

      {/* Bottom Scroll Indicator & Seamless Section Transition */}
      <div className="relative z-10 pb-8 sm:pb-12 text-center">
        <Container size="xl">
          <button
            type="button"
            onClick={scrollToNextSection}
            className="group inline-flex flex-col items-center gap-2.5 text-cream-300 hover:text-caramel-300 transition-colors focus-visible:outline-none cursor-pointer"
            aria-label="Scroll down to explore craftsmanship section"
          >
            <span className="text-[11px] uppercase tracking-cinematic font-mono text-cream-400 group-hover:text-caramel-400 transition-colors">
              SCROLL TO DISCOVER
            </span>
            <div className="w-5 h-8 rounded-full border border-roast-600 group-hover:border-caramel-500/70 flex items-start justify-center p-1 transition-colors">
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeInOut',
                }}
                className="w-1 h-1.5 rounded-full bg-caramel-400"
              />
            </div>
            <ChevronDown className="w-4 h-4 text-cream-400 group-hover:text-caramel-400 group-hover:translate-y-0.5 transition-all -mt-1" />
          </button>
        </Container>
      </div>
    </section>
  );
};
