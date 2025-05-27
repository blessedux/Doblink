import React from 'react';
import Navbar from './components/ui/Navbar';
import Button from './components/ui/Button';
import BackgroundGradient from './components/ui/BackgroundGradient';
import TokenMarketplaceWindow from './components/token-marketplace/TokenMarketplaceWindow';
import { PrivyProvider } from './contexts/PrivyProvider';

function App() {
  return (
    <PrivyProvider>
      <BackgroundGradient className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <TokenMarketplaceWindow />
        </main>
        <footer className="py-4 text-center text-xs text-white/40">
          DOB Protocol
        </footer>
      </BackgroundGradient>
    </PrivyProvider>
  );
}

export default App;
