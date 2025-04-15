import type React from 'react';

interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
}

interface TokenSelectorProps {
  selectedToken: TokenInfo;
  onTokenClick: () => void;
  className?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenClick,
  className = '',
}) => {
  return (
    <button
      className={`token-select ${className}`}
      onClick={onTokenClick}
      type="button"
    >
      <img
        src={selectedToken.logo}
        alt={`${selectedToken.name} logo`}
        className="w-6 h-6 rounded-full mr-2"
      />
      <span className="font-semibold">{selectedToken.symbol}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1"
      >
        <path
          d="M3 5L6 8L9 5"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default TokenSelector;
