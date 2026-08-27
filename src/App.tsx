import React from 'react';
import { HomePage } from './pages/HomePage';
import { SkipLink } from './components/ui/SkipLink';
import { CartProvider } from './context/CartContext';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-espresso-950 text-cream-100 antialiased">
        <SkipLink targetId="main-content" />
        <HomePage />
      </div>
    </CartProvider>
  );
};

export default App;
