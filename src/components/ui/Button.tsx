import type React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'connect';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'py-3 px-6 font-medium text-center rounded-2xl transition-all duration-200';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'swap-button',
    secondary: 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50',
    connect: 'connect-wallet-button',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
