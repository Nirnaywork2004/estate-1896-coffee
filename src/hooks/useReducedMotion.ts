import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect if the user has requested reduced motion in system preferences.
 * Essential for respectful cinematic animations and WCAG 2.1 compliance.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
