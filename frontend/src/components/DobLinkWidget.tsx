import React, { useState, useEffect } from 'react';
import { DobLinkWidgetConfig } from '../widget';
import apiService from '../services/api';

interface DobLinkWidgetProps {
  config: DobLinkWidgetConfig;
  onClose: () => void;
}

// Wallet connection states
type WalletState = 'disconnected' | 'connecting' | 'connected' | 'error';

// Investment flow states
type InvestmentState = 'preview' | 'amount' | 'wallet-connect' | 'transaction' | 'success' | 'error';

const DobLinkWidget: React.FC<DobLinkWidgetProps> = ({ config, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [apr, setApr] = useState(12.08);
  const [tvl, setTvl] = useState(2.41);
  const [aprKey, setAprKey] = useState(0);
  const [tvlKey, setTvlKey] = useState(0);
  const [isAprVisible, setIsAprVisible] = useState(true);
  const [isTvlVisible, setIsTvlVisible] = useState(true);
  
  // Wallet and investment states
  const [walletState, setWalletState] = useState<WalletState>('disconnected');
  const [investmentState, setInvestmentState] = useState<InvestmentState>('preview');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get current domain for analytics
  const getCurrentDomain = () => {
    return window.location.hostname || 'unknown';
  };

  // Track widget view on mount
  useEffect(() => {
    if (config.hash) {
      apiService.trackWidgetView(config.hash, getCurrentDomain());
    }
  }, [config.hash]);

  // Update APR and TVL every 10 seconds with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAprVisible(false);
      setIsTvlVisible(false);
      
      setTimeout(() => {
        setApr(parseFloat((12.06 + Math.random() * 0.06).toFixed(2)));
        setTvl(parseFloat((2.40 + Math.random() * 0.02).toFixed(2)));
        setAprKey(prev => prev + 1);
        setTvlKey(prev => prev + 1);
        
        setIsAprVisible(true);
        setIsTvlVisible(true);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Check for existing wallet connection
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletState('connected');
        }
      } catch (err) {
        setWalletState('disconnected');
      }
    }
  };

  const connectWallet = async () => {
    setWalletState('connecting');
    setErrorMessage('');
    
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletState('connected');
          
          // Track wallet connection
          if (config.hash) {
            apiService.trackWalletConnect(config.hash, getCurrentDomain());
          }
          
          setInvestmentState('amount');
        } else {
          throw new Error('No accounts found');
        }
      } else {
        throw new Error('No wallet detected. Please install MetaMask or another wallet.');
      }
    } catch (err: any) {
      setWalletState('error');
      setErrorMessage(err.message || 'Failed to connect wallet');
    }
  };

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    if (walletState === 'connected') {
      setInvestmentState('transaction');
      processTransaction();
    } else {
      setInvestmentState('wallet-connect');
    }
  };

  const processTransaction = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // TODO: Implement actual transaction logic with smart contracts
      // 1. Validate amount
      // 2. Check USDC balance
      // 3. Call smart contract
      // 4. Wait for confirmation
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate transaction
      
      // Track successful sale
      if (config.hash) {
        apiService.trackSale(config.hash, getCurrentDomain(), parseFloat(amount));
      }
      
      setInvestmentState('success');
      setIsLoading(false);
      
      // Reset after success
      setTimeout(() => {
        setInvestmentState('preview');
        setAmount('');
      }, 3000);
      
    } catch (err: any) {
      setInvestmentState('error');
      setErrorMessage(err.message || 'Transaction failed');
      setIsLoading(false);
    }
  };

  const resetToPreview = () => {
    setInvestmentState('preview');
    setAmount('');
    setErrorMessage('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderContent = () => {
    switch (investmentState) {
      case 'preview':
        return (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm opacity-75">Token: {config.tokenId}</p>
            </div>

            {/* APR and TVL */}
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

            {/* CTA Button */}
            <button
              onClick={() => setInvestmentState('amount')}
              className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Invest Now
            </button>
          </>
        );

      case 'amount':
        return (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm opacity-75">Token: {config.tokenId}</p>
              <p className="text-xs opacity-60 mt-1">Enter investment amount</p>
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

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAmountSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
                className={`
                  w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
                  ${!amount || parseFloat(amount) <= 0
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }
                `}
              >
                Continue
              </button>
              <button
                onClick={resetToPreview}
                className="w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </>
        );

      case 'wallet-connect':
        return (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm opacity-75">Connect Wallet</p>
              <p className="text-xs opacity-60 mt-1">Required to complete investment</p>
            </div>

            {/* Investment Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Amount:</span>
                  <span className="font-medium">{amount} USDC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Token:</span>
                  <span className="font-medium">{config.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span>APR:</span>
                  <span className="font-medium text-green-600">{apr}%</span>
                </div>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="space-y-2">
              <button
                onClick={connectWallet}
                disabled={walletState === 'connecting'}
                className={`
                  w-full py-3 px-4 rounded-xl font-medium transition-all duration-200
                  ${walletState === 'connecting'
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }
                `}
              >
                {walletState === 'connecting' ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </div>
                ) : (
                  'Connect Wallet'
                )}
              </button>
              <button
                onClick={() => setInvestmentState('amount')}
                className="w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}
          </>
        );

      case 'transaction':
        return (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-sm opacity-75">Processing Transaction</p>
              <p className="text-xs opacity-60 mt-1">Please wait...</p>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Amount:</span>
                  <span className="font-medium">{amount} USDC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Token:</span>
                  <span className="font-medium">{config.tokenId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Wallet:</span>
                  <span className="font-medium">{walletAddress ? formatAddress(walletAddress) : 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600">Confirming transaction...</p>
            </div>
          </>
        );

      case 'success':
        return (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium">Investment Successful!</p>
              <p className="text-xs opacity-60 mt-1">Your transaction has been confirmed</p>
            </div>

            {/* Success Details */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Amount Invested:</span>
                  <span className="font-medium">{amount} USDC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Token:</span>
                  <span className="font-medium">{config.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected APR:</span>
                  <span className="font-medium text-green-600">{apr}%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-gray-600">Widget will reset automatically...</p>
          </>
        );

      case 'error':
        return (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm font-medium">Transaction Failed</p>
              <p className="text-xs opacity-60 mt-1">Please try again</p>
            </div>

            {/* Error Details */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setInvestmentState('amount')}
                className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={resetToPreview}
                className="w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Start Over
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dob-link-widget">
      <div className={`
        w-full max-w-md mx-auto p-6 rounded-3xl shadow-2xl backdrop-blur-xl border
        ${config.theme === 'light' 
          ? 'bg-white/90 text-gray-800 border-white/20' 
          : 'bg-gray-900/90 text-white border-gray-700/50'
        }
      `}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DobLinkWidget; 