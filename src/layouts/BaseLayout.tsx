import React from 'react';
import { SkipLink } from '../components/ui/SkipLink';
import { cn } from '../lib/utils';

export interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-espresso-950 text-cream-100 flex flex-col', className)}>
      <SkipLink targetId="main-content" />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
    </div>
  );
};
