import type React from 'react';
import { useState } from 'react';
import TokenInput from './TokenInput';
import Button from '../ui/Button';
import SwitchIcon from '../ui/SwitchIcon';
import TokenModal from './TokenModal';

interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  isRWA?: boolean;
  apy?: number;
}

// Mock token data
const TOKENS: TokenInfo[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: '0.42',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    balance: '1205.75',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
    balance: '0.018',
  },
  {
    symbol: 'SOLAR',
    name: 'Solar Panel Token',
    logo: 'https://img.icons8.com/color/96/000000/solar-panel.png',
    balance: '120.5',
    isRWA: true,
    apy: 32.5,
  },
  {
    symbol: 'EVCH',
    name: 'EV Charging Token',
    logo: 'https://img.icons8.com/color/96/000000/electric-vehicle.png',
    balance: '250.0',
    isRWA: true,
    apy: 28.2,
  },
  {
    symbol: 'AGRI',
    name: 'Smart Farming Token',
    logo: 'https://img.icons8.com/color/96/000000/farm.png',
    balance: '75.8',
    isRWA: true,
    apy: 31.7,
  },
  {
    symbol: 'IOT',
    name: 'IoT Sensor Token',
    logo: 'https://img.icons8.com/color/96/000000/sensor.png',
    balance: '180.2',
    isRWA: true,
    apy: 29.5,
  },
];

const SwapWidget: React.FC = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[3]);
  const [showFromTokenModal, setShowFromTokenModal] = useState(false);
  const [showToTokenModal, setShowToTokenModal] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState('0.5');

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  // Mock exchange rate calculation
  const calculateExchangeRate = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) === 0) {
      setToAmount('');
      return;
    }

    // In a real app, this would call an API or smart contract
    let mockRate = 1.0;
    
    if (fromToken.symbol === 'ETH') {
      if (toToken.isRWA) {
        mockRate = 1950 / 100; // ETH to RWA token (assuming $1950 ETH price and RWA tokens around $100)
      } else if (toToken.symbol === 'USDC') {
        mockRate = 1950; // ETH to USDC
      } else if (toToken.symbol === 'WBTC') {
        mockRate = 1/16; // ETH to WBTC (assuming 1 BTC = 16 ETH)
      }
    } else if (toToken.symbol === 'ETH') {
      if (fromToken.isRWA) {
        mockRate = 100 / 1950; // RWA token to ETH
      } else if (fromToken.symbol === 'USDC') {
        mockRate = 1/1950; // USDC to ETH
      } else if (fromToken.symbol === 'WBTC') {
        mockRate = 16; // WBTC to ETH
      }
    } else if (fromToken.isRWA && toToken.isRWA) {
      // RWA to RWA based on relative APY
      mockRate = (toToken.apy || 30) / (fromToken.apy || 30);
    } else {
      mockRate = 1.2; // Default fallback rate
    }

    const result = Number.parseFloat(fromAmount) * mockRate;
    setToAmount(result.toFixed(6));
  };

  const handleFromAmountChange = (newValue: string) => {
    setFromAmount(newValue);
    // In a real app, we would debounce this call
    setTimeout(calculateExchangeRate, 500);
  };

  const isSwapDisabled = !fromAmount || Number.parseFloat(fromAmount) === 0 || !toAmount || fromToken.symbol === toToken.symbol;

  return (
    <div className="swap-container p-4 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Swap</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          aria-label="Settings"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 13.3333C11.8409 13.3333 13.3333 11.8409 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66667 8.15905 6.66667 10C6.66667 11.8409 8.15905 13.3333 10 13.3333Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.6667 10C16.6667 10 15 15 10 15C5 15 3.33333 10 3.33333 10C3.33333 10 5 5 10 5C15 5 16.6667 10 16.6667 10Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <TokenInput
        token={fromToken}
        value={fromAmount}
        onChange={handleFromAmountChange}
        onTokenClick={() => setShowFromTokenModal(true)}
        label="From"
        maxAmount={fromToken.balance}
        className="mb-1"
      />

      <SwitchIcon onClick={handleSwapTokens} />

      <TokenInput
        token={toToken}
        value={toAmount}
        onChange={setToAmount}
        onTokenClick={() => setShowToTokenModal(true)}
        label="To"
        className="mt-1 mb-4"
      />

      {fromAmount && toAmount && fromToken.symbol !== toToken.symbol && (
        <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
          <div className="flex justify-between">
            <span>Exchange Rate</span>
            <span>
              1 {fromToken.symbol} ≈ {(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Slippage Tolerance</span>
            <span>{slippageTolerance}%</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Minimum Received</span>
            <span>
              {(Number.parseFloat(toAmount) * (1 - Number.parseFloat(slippageTolerance) / 100)).toFixed(6)} {toToken.symbol}
            </span>
          </div>
          {toToken.isRWA && (
            <div className="flex justify-between mt-1 text-emerald-600 font-medium">
              <span>Expected APY</span>
              <span>{toToken.apy}%</span>
            </div>
          )}
        </div>
      )}

      <Button
        variant="primary"
        fullWidth
        disabled={isSwapDisabled}
        onClick={() => alert('Swap would happen here with real wallet connection')}
      >
        {isSwapDisabled
          ? "Enter an amount"
          : `Swap ${fromToken.symbol} for ${toToken.symbol}`}
      </Button>

      <div className="text-xs text-center mt-4 text-gray-500">
        Powered by DOB Protocol
      </div>

      <TokenModal
        isOpen={showFromTokenModal}
        onClose={() => setShowFromTokenModal(false)}
        onSelectToken={setFromToken}
        tokens={TOKENS.filter(token => token.symbol !== toToken.symbol)}
      />

      <TokenModal
        isOpen={showToTokenModal}
        onClose={() => setShowToTokenModal(false)}
        onSelectToken={setToToken}
        tokens={TOKENS.filter(token => token.symbol !== fromToken.symbol)}
      />
    </div>
  );
};

export default SwapWidget;
