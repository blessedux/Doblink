import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  isRWA: boolean;
  isAgent: boolean;
  apy: number;
  region?: string;
  description: string;
}

// Mock token data - both device tokens and agent tokens
const TOKENS: TokenInfo[] = [
  // Device/Infrastructure Tokens
  {
    id: 'solar-1',
    symbol: 'SOLAR',
    name: 'Solar Panel Network',
    logo: 'https://img.icons8.com/color/96/000000/solar-panel.png',
    balance: '0',
    isRWA: true,
    isAgent: false,
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
    isAgent: false,
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
    isAgent: false,
    apy: 25.8,
    region: 'Global Network',
    description: 'Community-owned WiFi hotspots providing internet access',
  },
  // Agent Tokens
  {
    id: 'solaryield-agent',
    symbol: 'SOLYLD',
    name: 'SolarYield Agent',
    logo: 'https://img.icons8.com/color/96/000000/artificial-intelligence.png',
    balance: '0',
    isRWA: true,
    isAgent: true,
    apy: 34.5,
    description: 'AI agent specializing in managing solar infrastructure investments',
  },
  {
    id: 'infraboost-agent',
    symbol: 'INFRB',
    name: 'InfraBoost Agent',
    logo: 'https://img.icons8.com/color/96/000000/bot.png',
    balance: '0',
    isRWA: true,
    isAgent: true,
    apy: 31.2,
    description: 'Agent optimizing infrastructure portfolio for maximum yield',
  }
];

const FarmWidget: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'devices' | 'agents'>('devices');
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(TOKENS.find(t => !t.isAgent) || TOKENS[0]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [userTokens, setUserTokens] = useState<{[key: string]: number}>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userPortfolioValue, setUserPortfolioValue] = useState(0);
  const [estimatedYearlyYield, setEstimatedYearlyYield] = useState(0);

  // Filter tokens based on active tab
  const filteredTokens = TOKENS.filter(token => 
    activeTab === 'devices' ? !token.isAgent : token.isAgent
  );

  // Update portfolio value and estimated yield
  useEffect(() => {
    let portfolioValue = 0;
    let yearlyYield = 0;
    
    Object.entries(userTokens).forEach(([tokenId, amount]) => {
      if (amount > 0) {
        const token = TOKENS.find(t => t.id === tokenId);
        if (token) {
          portfolioValue += amount;
          yearlyYield += amount * (token.apy / 100);
        }
      }
    });
    
    setUserPortfolioValue(portfolioValue);
    setEstimatedYearlyYield(yearlyYield);
  }, [userTokens]);

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
    <div className="farm-container p-4 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Yield Farming</h2>
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

      {/* Portfolio Summary (if user has invested) */}
      {userPortfolioValue > 0 && (
        <div className="bg-white border border-purple-100 rounded-xl p-4 mb-4 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-2">Your Portfolio</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="font-bold text-xl">${userPortfolioValue.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500">Est. Yearly Yield</div>
              <div className="font-bold text-xl text-emerald-600">${estimatedYearlyYield.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Successfully invested ${investmentAmount} in {selectedToken.name}!</span>
        </div>
      )}

      {/* Tab navigation for Device vs Agent tokens */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === 'devices' 
              ? 'bg-white shadow-sm text-gray-800' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('devices');
            setSelectedToken(TOKENS.find(t => !t.isAgent) || TOKENS[0]);
          }}
        >
          Infrastructure
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === 'agents' 
              ? 'bg-white shadow-sm text-gray-800' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('agents');
            setSelectedToken(TOKENS.find(t => t.isAgent) || TOKENS[4]);
          }}
        >
          AI Agents
        </button>
      </div>

      {/* Investment Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-700 font-medium">Select {activeTab === 'devices' ? 'Infrastructure' : 'Agent'}</span>
          <button 
            className="flex items-center space-x-1 font-medium text-purple-600"
            onClick={() => setShowTokenModal(true)}
          >
            <div className="flex items-center">
              <img src={selectedToken.logo} alt={selectedToken.name} className="w-6 h-6 mr-2" />
              <span>{selectedToken.symbol}</span>
            </div>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg mb-4">
          <p className="text-gray-600 text-sm mb-2">{selectedToken.description}</p>
          {selectedToken.region && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{selectedToken.region}</span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount (USD)
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
          <div className="flex justify-between items-center mb-1 font-medium">
            <span className="text-gray-700">Annual Yield (APY):</span>
            <span className="text-emerald-600">{selectedToken.apy}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Estimated yearly return:</span>
            <span className="text-emerald-600 font-medium">
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
            : `Invest $${investmentAmount} in ${selectedToken.symbol}`}
        </Button>
      </div>

      {/* Holdings Summary */}
      {Object.keys(userTokens).some(tokenId => userTokens[tokenId] > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-3">Your DePIN Holdings</h3>
          <div className="space-y-3">
            {Object.entries(userTokens)
              .filter(([_, amount]) => amount > 0)
              .map(([tokenId, amount]) => {
                const token = TOKENS.find(t => t.id === tokenId);
                if (!token) return null;
                
                return (
                  <div key={tokenId} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                    <img src={token.logo} alt={token.name} className="w-8 h-8 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="font-medium">${amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{token.isAgent ? 'AI Agent' : 'Infrastructure'}</span>
                        <span className="text-emerald-600">+${(amount * token.apy / 100).toFixed(2)}/yr</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Information box */}
      <div className="bg-indigo-50 p-4 rounded-xl mb-4 border border-indigo-100">
        <h3 className="font-medium text-indigo-800 mb-2">About {activeTab === 'devices' ? 'Infrastructure' : 'Agent'} Yield Farming</h3>
        <ul className="text-sm text-indigo-700 space-y-2">
          {activeTab === 'devices' ? (
            <>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Invest directly in real-world infrastructure like solar panels, EV chargers, and WiFi hotspots</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Earn steady APY from actual device usage and revenue</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Become a co-owner of decentralized physical infrastructure</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Employ AI agents to optimize your infrastructure investments</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Agents automatically rebalance your portfolio for maximum returns</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Higher potential APY through expert AI management strategies</span>
              </li>
            </>
          )}
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
                <h3 className="text-lg font-medium">
                  Select {activeTab === 'devices' ? 'Infrastructure' : 'Agent'} Token
                </h3>
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
                {filteredTokens.map((token) => (
                  <button
                    key={token.id}
                    className="w-full text-left flex items-center p-3 hover:bg-gray-50 rounded-xl"
                    onClick={() => selectToken(token)}
                    type="button"
                  >
                    <img src={token.logo} alt={token.name} className="w-8 h-8 mr-3" />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-emerald-600 font-medium">{token.apy}% APY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">{token.name}</span>
                        {userTokens[token.id] > 0 && (
                          <span className="text-sm text-gray-500">Owned: ${userTokens[token.id]}</span>
                        )}
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