import { Fragment } from 'react';
import type React from 'react';

interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
  isRWA?: boolean;
  apy?: number;
}

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: TokenInfo) => void;
  tokens: TokenInfo[];
}

const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  tokens,
}) => {
  if (!isOpen) return null;

  const handleSelectToken = (token: TokenInfo) => {
    onSelectToken(token);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-white rounded-xl max-w-md w-full mx-4 p-4 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Select a token</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              type="button"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search name or paste address"
            />
          </div>

          <div className="overflow-y-auto max-h-96">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                className="w-full text-left flex items-center p-3 hover:bg-gray-50 rounded-xl"
                onClick={() => handleSelectToken(token)}
                type="button"
              >
                <img src={token.logo} alt={token.name} className="w-8 h-8 mr-3" />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="font-medium">{token.symbol}</span>
                    {token.balance && <span className="text-gray-500">{token.balance}</span>}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{token.name}</span>
                    {token.isRWA && token.apy && (
                      <span className="text-sm text-emerald-600 font-medium">APY: {token.apy}%</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
