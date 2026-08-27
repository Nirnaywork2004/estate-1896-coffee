import React from 'react';
import { cn } from '../../lib/utils';
import { FOCUS_RING_CLASSES } from '../../utils/accessibility';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'copper';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-editorial transition-all duration-200 cursor-pointer select-none rounded-sm disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-5 py-2.5 gap-2 h-11',
      lg: 'text-base px-7 py-3.5 gap-2.5 h-13',
    };

    const variantStyles = {
      primary:
        'bg-caramel-500 text-espresso-950 hover:bg-caramel-400 active:bg-caramel-600 shadow-warm-sm hover:shadow-caramel-glow font-semibold',
      secondary:
        'bg-roast-700 text-cream-100 hover:bg-roast-600 active:bg-roast-800 border border-roast-600 hover:border-roast-500',
      copper:
        'bg-copper-500 text-cream-50 hover:bg-copper-400 active:bg-copper-600 shadow-warm-sm hover:shadow-copper-glow font-semibold',
      outline:
        'bg-transparent text-cream-200 border border-roast-600 hover:border-caramel-500/80 hover:text-caramel-300 hover:bg-roast-900/40',
      ghost:
        'bg-transparent text-cream-300 hover:text-cream-50 hover:bg-roast-800/60',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          FOCUS_RING_CLASSES,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
