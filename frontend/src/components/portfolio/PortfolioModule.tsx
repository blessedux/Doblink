import React from 'react';
import { useWallet } from '../../hooks/useWallet';

// This would be replaced by a real fetch from backend or on-chain in the future
const RWA_TOKENS = [
  {
    symbol: 'SOLAR',
    name: 'Solar Panel Network',
    apy: 32.5,
    icon: 'https://img.icons8.com/color/96/000000/solar-panel.png',
  },
  {
    symbol: 'WIFI',
    name: 'Decentralized WiFi',
    apy: 24.1,
    icon: 'https://img.icons8.com/color/96/000000/wifi.png',
  },
];

const PortfolioModule: React.FC = () => {
  const { address, isConnected } = useWallet();

  // Simulate an empty portfolio for all wallets (no mock assets)
  const userPortfolio: any[] = [];

  const totalValue = 0;
  const totalYield = 0;

  return (
    <div className="max-w-3xl w-full mx-auto mt-12 rounded-2xl bg-white/70 border border-[#E3EAFD] shadow-lg p-8" style={{boxShadow: '0 4px 24px 0 rgba(80, 112, 255, 0.08)'}}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <h2 className="text-2xl font-semibold text-gray-700">Your Asset Portfolio</h2>
        <div className="flex gap-8 md:gap-12 justify-between md:justify-end">
          <div className="text-right">
            <div className="text-gray-500 text-sm">Total Value</div>
            <div className="text-2xl font-semibold text-gray-700">${totalValue}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-sm">Est. Annual Yield</div>
            <div className="text-2xl font-semibold text-[#597CE9]">${totalYield.toFixed(2)}</div>
          </div>
        </div>
      </div>
      {/* Empty State Only */}
      <div className="text-center text-gray-400 py-12 text-lg">
        {isConnected
          ? 'No assets found. Once you hold a TRUFA validated Token of the DOB ecosystem, it will show up in your portfolio.'
          : 'Connect your wallet to view your portfolio.'}
      </div>
    </div>
  );
};

export default PortfolioModule; 