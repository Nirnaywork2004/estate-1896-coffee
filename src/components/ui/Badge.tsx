import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'caramel' | 'copper' | 'roast' | 'outline' | 'success' | 'amber';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'roast',
  size = 'md',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-editorial',
    md: 'text-xs px-2.5 py-1 font-medium tracking-editorial',
  };

  const variantStyles = {
    caramel: 'bg-caramel-500/15 text-caramel-400 border border-caramel-500/30',
    copper: 'bg-copper-500/15 text-copper-400 border border-copper-500/30',
    roast: 'bg-roast-800 text-cream-200 border border-roast-700',
    outline: 'bg-transparent text-cream-300 border border-roast-600',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-800/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full uppercase transition-colors',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
