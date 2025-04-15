import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  isRWA: boolean;
  apy: number;
}

// Mock token data - focusing only on RWA tokens for farming
const TOKENS: TokenInfo[] = [
  {
    symbol: 'SOLAR',
    name: 'Solar Panel Token',
    logo: 'https://img.icons8.com/color/96/000000/solar-panel.png',
    balance: '0',
    isRWA: true,
    apy: 32.5,
  },
  {
    symbol: 'EVCH',
    name: 'EV Charging Token',
    logo: 'https://img.icons8.com/color/96/000000/electric-vehicle.png',
    balance: '0',
    isRWA: true,
    apy: 28.2,
  },
  {
    symbol: 'AGRI',
    name: 'Smart Farming Token',
    logo: 'https://img.icons8.com/color/96/000000/farm.png',
    balance: '0',
    isRWA: true,
    apy: 31.7,
  },
  {
    symbol: 'IOT',
    name: 'IoT Sensor Token',
    logo: 'https://img.icons8.com/color/96/000000/sensor.png',
    balance: '0',
    isRWA: true,
    apy: 29.5,
  },
];

const FarmWidget: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(TOKENS[0]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [userTokens, setUserTokens] = useState<{[key: string]: number}>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Update token balances from userTokens state
  useEffect(() => {
    const updatedTokens = TOKENS.map(token => ({
      ...token,
      balance: userTokens[token.symbol]?.toString() || '0'
    }));
    // No need to set state here, we're just updating the reference data
  }, [userTokens]);

  const handleInvestment = () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) return;
    
    // In a real app, this would connect to a smart contract
    const amount = parseFloat(investmentAmount);
    
    setUserTokens(prev => ({
      ...prev,
      [selectedToken.symbol]: (prev[selectedToken.symbol] || 0) + amount
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
    <div className="farm-container p-4 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Farm RWA Tokens</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          aria-label="Info"
          type="button"
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
      </div>

      {/* Show token holdings if user has any */}
      {Object.keys(userTokens).length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Your RWA Token Holdings</h3>
          {Object.entries(userTokens)
            .filter(([_, amount]) => amount > 0)
            .map(([symbol, amount]) => {
              const token = TOKENS.find(t => t.symbol === symbol);
              if (!token || amount <= 0) return null;
              
              return (
                <div key={symbol} className="flex items-center justify-between mb-2 last:mb-0">
                  <div className="flex items-center">
                    <img src={token.logo} alt={token.name} className="w-6 h-6 mr-2" />
                    <span className="font-medium">{symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{amount.toLocaleString()} tokens</div>
                    <div className="text-xs text-emerald-600">APY: {token.apy}%</div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Successfully purchased {selectedToken.symbol} tokens!</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Select Token</span>
          <button 
            className="flex items-center space-x-1 font-medium text-purple-600"
            onClick={() => setShowTokenModal(true)}
          >
            <div className="flex items-center">
              <img src={selectedToken.logo} alt={selectedToken.name} className="w-6 h-6 mr-2" />
              <span>{selectedToken.symbol}</span>
            </div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              id="investment-amount"
              className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Token:</span>
            <span className="font-medium">{selectedToken.name}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">APY:</span>
            <span className="font-medium text-emerald-600">{selectedToken.apy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Est. Yearly Return:</span>
            <span className="font-medium text-emerald-600">
              ${calculateYearlyReturn(investmentAmount, selectedToken.apy)}
            </span>
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
            : `Buy ${selectedToken.symbol} Tokens`}
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Why Farm RWA Tokens?</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Earn high APY from real-world asset investments (~30%)</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Tokens backed by physical assets like solar panels and EV charging stations</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Employ agents to maximize your yield farming strategy</span>
          </li>
        </ul>
      </div>

      <div className="text-xs text-center mt-4 text-gray-500">
        Powered by DOB Protocol
      </div>

      {/* Token selection modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowTokenModal(false)} />
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative bg-white rounded-xl max-w-md w-full mx-4 p-4 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Select a RWA token</h3>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="text-gray-400 hover:text-gray-500"
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
                    key={token.symbol}
                    className="w-full text-left flex items-center p-3 hover:bg-gray-50 rounded-xl"
                    onClick={() => selectToken(token)}
                    type="button"
                  >
                    <img src={token.logo} alt={token.name} className="w-8 h-8 mr-3" />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="font-medium">{token.symbol}</span>
                        {userTokens[token.symbol] > 0 && (
                          <span className="text-gray-500">{userTokens[token.symbol]} tokens</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">{token.name}</span>
                        <span className="text-sm text-emerald-600 font-medium">APY: {token.apy}%</span>
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