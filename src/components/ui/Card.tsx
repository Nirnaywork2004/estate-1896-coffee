import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'outline';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  as: Component = 'div',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-espresso-900/90 border border-roast-700/60 shadow-warm-sm',
    elevated: 'bg-gradient-to-b from-roast-800/80 to-espresso-900/90 border border-roast-700/80 shadow-warm-md',
    interactive: 'bg-espresso-900/80 border border-roast-700/60 hover:border-caramel-500/50 hover:shadow-warm-lg transition-all duration-300',
    outline: 'bg-transparent border border-roast-700/70',
  };

  return (
    <Component
      className={cn('rounded-lg p-6 backdrop-blur-sm', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
