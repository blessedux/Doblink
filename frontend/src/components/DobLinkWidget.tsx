import React, { useState, useEffect } from 'react';
import { DobLinkWidgetConfig } from '../widget';

interface DobLinkWidgetProps {
  config: DobLinkWidgetConfig;
  onClose: () => void;
}

const DobLinkWidget: React.FC<DobLinkWidgetProps> = ({ config, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [apr, setApr] = useState(12.08);
  const [tvl, setTvl] = useState(2.41);
  const [aprKey, setAprKey] = useState(0);
  const [tvlKey, setTvlKey] = useState(0);
  const [isAprVisible, setIsAprVisible] = useState(true);
  const [isTvlVisible, setIsTvlVisible] = useState(true);

  // Update APR and TVL every 10 seconds with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsAprVisible(false);
      setIsTvlVisible(false);
      
      // Update values after fade out
      setTimeout(() => {
        setApr(parseFloat((12.06 + Math.random() * 0.06).toFixed(2)));
        setTvl(parseFloat((2.40 + Math.random() * 0.02).toFixed(2)));
        setAprKey(prev => prev + 1);
        setTvlKey(prev => prev + 1);
        
        // Fade in
        setIsAprVisible(true);
        setIsTvlVisible(true);
      }, 300); // Wait 300ms for fade out
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleInvest = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    // TODO: Implement investment flow
    // 1. Connect wallet
    // 2. Show token info
    // 3. Handle USDC deposit
    setTimeout(() => {
      setIsLoading(false);
      setIsExpanded(false);
      setAmount('');
    }, 2000);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  return (
    <div className="dob-link-widget">
      {/* Floating Button */}
      <button
        onClick={toggleExpanded}
        className={`
          fixed z-50 p-4 rounded-full shadow-2xl transition-all duration-300 backdrop-blur-md
          ${config.theme === 'light' 
            ? 'bg-white/80 text-gray-800 hover:bg-white/90 border border-white/20' 
            : 'bg-blue-600/80 text-white hover:bg-blue-600/90 border border-blue-400/20'
          }
          ${isExpanded ? 'scale-110' : 'scale-100'}
        `}
        style={{
          ...config.customStyles,
          ...getPositionStyles(config.position)
        }}
      >
      </button>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className={`
            relative max-w-md w-full mx-4 p-6 rounded-3xl shadow-2xl backdrop-blur-xl border
            ${config.theme === 'light' 
              ? 'bg-white/90 text-gray-800 border-white/20' 
              : 'bg-gray-900/90 text-white border-gray-700/50'
            }
          `}>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm opacity-75">Token: {config.tokenId}</p>
            </div>

            {/* APR and TVL on the right side */}
            <div className="flex justify-end gap-4 mb-6">
              <div className="text-right">
                <div className="text-xs opacity-75 mb-1">APR</div>
                <div 
                  key={aprKey}
                  className={`text-green-500 font-bold text-sm transition-opacity duration-300 ${
                    isAprVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {apr}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75 mb-1">TVL</div>
                <div 
                  key={tvlKey}
                  className={`font-bold text-sm transition-opacity duration-300 ${
                    isTvlVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  ${tvl}M
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Investment Amount (USDC)</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none
                    ${config.theme === 'light'
                      ? 'bg-white/80 border-gray-200 focus:border-blue-500 text-gray-800'
                      : 'bg-gray-800/80 border-gray-600 focus:border-blue-400 text-white'
                    }
                  `}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm opacity-60">USDC</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleInvest}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className={`
                w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
                ${isLoading || !amount || parseFloat(amount) <= 0
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Invest with USDC'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getPositionStyles(position: string = 'bottom-right'): React.CSSProperties {
  switch (position) {
    case 'bottom-left':
      return { bottom: '20px', left: '20px' };
    case 'top-right':
      return { top: '20px', right: '20px' };
    case 'top-left':
      return { top: '20px', left: '20px' };
    default:
      return { bottom: '20px', right: '20px' };
  }
}

export default DobLinkWidget; 