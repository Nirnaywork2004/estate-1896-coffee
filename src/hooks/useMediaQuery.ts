import { useState, useEffect } from 'react';

/**
 * Hook to listen to CSS media queries for responsive composition
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(listener);
      return () => mediaQueryList.removeListener(listener);
    }
  }, [query]);

  return matches;
}

/**
 * Pre-defined responsive hooks mapping to design tokens
 */
export function useBreakpoint() {
  const isXs = useMediaQuery('(min-width: 360px)');
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isTab = useMediaQuery('(min-width: 820px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2Xl = useMediaQuery('(min-width: 1440px)');
  const is3Xl = useMediaQuery('(min-width: 1920px)');
  const is4Xl = useMediaQuery('(min-width: 2560px)');

  return {
    isXs,
    isSm,
    isMd,
    isTab,
    isLg,
    isXl,
    is2Xl,
    is3Xl,
    is4Xl,
  };
}
