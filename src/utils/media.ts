/**
 * Performance & Media Foundation Utilities
 */

export interface OptimizedImageProps {
  src: string;
  width?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

/**
 * Transforms external image URLs (e.g. Unsplash or Supabase Storage) with responsive CDN optimizations
 */
export function getOptimizedImageUrl({
  src,
  width = 800,
  quality = 80,
  format = 'webp',
}: OptimizedImageProps): string {
  if (!src) return '';

  // If Unsplash image, apply auto format, quality, and width parameters
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fm', format === 'auto' ? 'webp' : format);
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }

  return src;
}

/**
 * Generates an accessible video object with poster fallback for cinematic backgrounds
 */
export interface CinematicVideoConfig {
  desktopSrc: string;
  mobileSrc?: string;
  posterSrc: string;
  ariaLabel: string;
}

export function getCinematicVideoProps(config: CinematicVideoConfig) {
  return {
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: 'metadata' as const,
    poster: config.posterSrc,
    'aria-label': config.ariaLabel,
  };
}
