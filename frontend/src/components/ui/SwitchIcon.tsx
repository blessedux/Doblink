import type React from 'react';

interface SwitchIconProps {
  onClick?: () => void;
  className?: string;
}

const SwitchIcon: React.FC<SwitchIconProps> = ({ onClick, className = '' }) => {
  return (
    <button
      className={`switch-tokens ${className}`}
      onClick={onClick}
      aria-label="Switch tokens"
      type="button"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 5.5L8 2L11.5 5.5"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 10.5L8 14L4.5 10.5"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default SwitchIcon;
