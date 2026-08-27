/**
 * Accessibility (a11y) Foundation Utilities
 */

/**
 * Standard focus visible classes matching the warm copper & caramel aesthetic
 */
export const FOCUS_RING_CLASSES =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-400 focus-visible:ring-offset-2 focus-visible:ring-offset-espresso-950';

/**
 * Generates an accessible screen reader only class string
 */
export const SR_ONLY_CLASSES = 'sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4';

/**
 * Accessible announcement helper for screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const elementId = `a11y-announcer-${priority}`;
  let liveRegion = document.getElementById(elementId);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = elementId;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = '';
  // Small timeout to ensure DOM registers change
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, 50);
}
