import React from 'react';
import Button from './components/ui/Button';
import BackgroundGradient from './components/ui/BackgroundGradient';
import TokenMarketplaceWindow from './components/token-marketplace/TokenMarketplaceWindow';
import PortfolioModule from './components/portfolio/PortfolioModule';
import { PrivyProvider } from './contexts/PrivyProvider';

function App() {
  return (
    <PrivyProvider>
      <BackgroundGradient className="min-h-screen flex flex-col">
        {/* <Navbar /> Removed for embeddable widget */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 gap-12">
          <TokenMarketplaceWindow />
          <PortfolioModule />
        </main>
        <footer className="py-4 text-center text-xs text-white/40">
          DOB Protocol
        </footer>
      </BackgroundGradient>
    </PrivyProvider>
  );
}

export default App;
