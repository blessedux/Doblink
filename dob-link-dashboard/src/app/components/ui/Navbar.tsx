import type React from 'react';
import { ConnectWallet } from './ConnectWallet';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex justify-center mt-6 mb-8">
      <div
        className="flex items-center justify-between px-6 py-2 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl bg-white/60 dark:bg-white/10 max-w-3xl w-full"
        style={{ minHeight: 56 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/dob-logo 1.png"
            alt="DOB Protocol Logo"
            className="w-9 h-9 rounded-full object-cover bg-white/80 shadow"
          />
        </div>
        {/* Wallet Connect (right) */}
        <div className="flex items-center ml-4">
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
