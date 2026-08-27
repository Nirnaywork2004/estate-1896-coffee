import React from 'react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
  className,
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50',
        'bg-caramel-500 text-espresso-950 font-semibold px-4 py-2 rounded-sm shadow-warm-lg',
        FOCUS_RING_CLASSES,
        className
      )}
    >
      {label}
    </a>
  );
};
