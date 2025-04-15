import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';

interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  isRWA: boolean;
  apy: number;
  region?: string;
  description: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  logo: string;
  strategy: string;
  performance: number;
  status: 'active' | 'idle' | 'optimizing';
  managedTokens: string[];
}

export interface AgentSuggestion {
  id: string;
  message: string;
  token?: string;
  timestamp: number;
  visible: boolean;
}

// Mock infrastructure token data
const TOKENS: TokenInfo[] = [
  {
    id: 'solar-1',
    symbol: 'SOLAR',
    name: 'Solar Panel Network',
    logo: 'https://img.icons8.com/color/96/000000/solar-panel.png',
    balance: '0',
    isRWA: true,
    apy: 32.5,
    region: 'California, USA',
    description: 'Tokenized yield from solar farms powering tech data centers',
  },
  {
    id: 'evch-1',
    symbol: 'EVCH',
    name: 'EV Charging Network',
    logo: 'https://img.icons8.com/color/96/000000/electric-vehicle.png',
    balance: '0',
    isRWA: true,
    apy: 28.2,
    region: 'Europe',
    description: 'Revenue from decentralized EV charging stations across major cities',
  },
  {
    id: 'wifi-1',
    symbol: 'WIFI',
    name: 'Decentralized WiFi',
    logo: 'https://img.icons8.com/color/96/000000/wifi.png',
    balance: '0',
    isRWA: true,
    apy: 25.8,
    region: 'Global Network',
    description: 'Community-owned WiFi hotspots providing internet access',
  },
];

// Mock agent data
export const AGENTS: AgentInfo[] = [
  {
    id: 'yield-optimizer',
    name: 'YieldMax',
    logo: 'https://img.icons8.com/color/96/000000/artificial-intelligence.png',
    strategy: 'Balanced growth across diverse infrastructure',
    performance: 34.2,
    status: 'active',
    managedTokens: ['SOLAR', 'EVCH'],
  }
];

// Agent suggestion messages
export const AGENT_MESSAGES = [
  { token: 'WIFI', message: "WiFi networks showing 12% growth in urban areas." },
  { token: 'SOLAR', message: "Solar yields up 8% this quarter, good entry point." },
  { token: 'EVCH', message: "EV adoption accelerating in Europe. Consider increasing position." },
  { token: 'WIFI', message: "Portfolio lacks connectivity assets, 6% APY increase possible." },
  { token: 'SOLAR', message: "Energy shortages predicted. Solar assets may outperform." },
  { token: 'EVCH', message: "New subsidy bill passed. EV charging networks to benefit." },
];

const FarmWidget: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(TOKENS[0]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [userTokens, setUserTokens] = useState<{[key: string]: number}>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const handleInvestment = () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) return;
    
    // In a real app, this would connect to a smart contract
    const amount = parseFloat(investmentAmount);
    
    setUserTokens(prev => ({
      ...prev,
      [selectedToken.id]: (prev[selectedToken.id] || 0) + amount
    }));
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    // Reset investment amount
    setInvestmentAmount('');
  };

  const calculateYearlyReturn = (amount: string, apy: number) => {
    if (!amount || isNaN(Number(amount))) return '0';
    const investment = parseFloat(amount);
    const yearly = investment * (apy / 100);
    return yearly.toFixed(2);
  };

  const selectToken = (token: TokenInfo) => {
    setSelectedToken(token);
    setShowTokenModal(false);
  };

  return (
    <div className="farm-container max-w-md w-full mx-auto">
      {/* Success message */}
      {showSuccessMessage && (
        <div className="bg-emerald-900/70 backdrop-blur-md border border-emerald-500/40 text-emerald-200 p-3 rounded-xl mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Success! Invested in {selectedToken.name}</span>
        </div>
      )}

      {/* Main Investment Card */}
      <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-xl p-5 shadow-lg">
        {/* Header with Info Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-white">Infrastructure Yield</h2>
          <div className="relative">
            <button
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Info"
              type="button"
              onMouseEnter={() => setShowTooltip('about')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8H12.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showTooltip === 'about' && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 z-50 shadow-xl text-sm text-white/90">
                <p className="mb-2">Earn yields from real-world infrastructure assets.</p>
                <p>Your connected AI agent will optimize your portfolio automatically.</p>
              </div>
            )}
          </div>
        </div>

        {/* Token Select */}
        <div className="relative mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/80">Invest in</label>
            <div className="relative">
              <button
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                onClick={() => setShowTokenModal(true)}
              >
                <div className="flex items-center">
                  <img src={selectedToken.logo} alt={selectedToken.name} className="w-5 h-5 mr-2" />
                  <span className="text-white font-medium">{selectedToken.symbol}</span>
                </div>
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="flex items-center mt-1">
                <span className="text-xs text-white/60 mr-1">{selectedToken.name}</span>
                <div className="relative">
                  <button
                    className="text-white/60 hover:text-white/80"
                    onMouseEnter={() => setShowTooltip('token')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16V12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8H12.01"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {showTooltip === 'token' && (
                    <div className="absolute left-0 -translate-x-1/2 top-full mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 z-50 shadow-xl text-sm text-white/90">
                      <p className="mb-1">{selectedToken.description}</p>
                      {selectedToken.region && (
                        <div className="flex items-center text-xs mt-2 text-white/80">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span>{selectedToken.region}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Amount */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="investment-amount" className="text-sm text-white/80">
              Amount
            </label>
            <div className="flex items-center">
              <span className="text-xs text-emerald-400 font-medium mr-1">{selectedToken.apy}% APY</span>
              <div className="relative">
                <button
                  className="text-white/60 hover:text-white/80"
                  onMouseEnter={() => setShowTooltip('apy')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16V12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8H12.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {showTooltip === 'apy' && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 z-50 shadow-xl text-sm text-white/90">
                    <p className="mb-1">Annual Percentage Yield: {selectedToken.apy}%</p>
                    <p className="text-xs text-white/80">Earn passive income from this infrastructure investment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/90">$</span>
            </div>
            <input
              type="text"
              id="investment-amount"
              className="block w-full pl-7 pr-12 py-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white text-lg"
              placeholder="0.00"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
            />
            {investmentAmount && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-sm">
                ≈ ${calculateYearlyReturn(investmentAmount, selectedToken.apy)}/yr
              </div>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
          onClick={handleInvestment}
        >
          {!investmentAmount || parseFloat(investmentAmount) <= 0
            ? "Enter an amount"
            : `Invest Now`}
        </Button>
      </div>

      {/* Token selection modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowTokenModal(false)} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative bg-black/50 backdrop-blur-xl border border-white/30 rounded-xl max-w-md w-full mx-4 p-5 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">
                  Select Token
                </h3>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="text-white/70 hover:text-white"
                  type="button"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-96">
                {TOKENS.map((token) => (
                  <button
                    key={token.id}
                    className="w-full text-left flex items-center p-3 hover:bg-white/10 rounded-xl transition-colors"
                    onClick={() => selectToken(token)}
                    type="button"
                  >
                    <img src={token.logo} alt={token.name} className="w-8 h-8 mr-3" />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="font-medium text-white">{token.symbol}</span>
                        <span className="text-emerald-400 font-medium">{token.apy}% APY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">{token.name}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmWidget; 