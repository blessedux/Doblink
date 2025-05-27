import type React from 'react';
import TokenSelector from './TokenSelector';

interface TokenInfo {
  symbol: string;
  name: string;
  logo: string;
  balance?: string;
}

interface TokenInputProps {
  token: TokenInfo;
  value: string;
  onChange: (value: string) => void;
  onTokenClick: () => void;
  label?: string;
  maxAmount?: string;
  className?: string;
}

const TokenInput: React.FC<TokenInputProps> = ({
  token,
  value,
  onChange,
  onTokenClick,
  label,
  maxAmount,
  className = '',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimals
    const newValue = e.target.value.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    const decimalCount = (newValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;

    onChange(newValue);
  };

  const handleMaxClick = () => {
    if (maxAmount) {
      onChange(maxAmount);
    }
  };

  return (
    <div className={`token-input p-4 ${className}`}>
      {label && (
        <div className="text-sm text-gray-500 mb-2">{label}</div>
      )}
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="0.0"
          className="text-3xl bg-transparent outline-none w-full"
        />
        <TokenSelector
          selectedToken={token}
          onTokenClick={onTokenClick}
        />
      </div>
      <div className="flex justify-between items-center mt-2 text-sm">
        <div className="text-gray-500">
          {value && token.symbol && (
            <span>≈ ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )}
        </div>
        {maxAmount && (
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">Balance: {token.balance}</span>
            <button
              onClick={handleMaxClick}
              className="text-[#FF007A] font-medium hover:text-opacity-80"
              type="button"
            >
              MAX
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenInput;
