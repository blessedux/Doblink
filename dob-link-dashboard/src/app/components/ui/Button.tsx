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
  const baseClasses = 'py-3 px-6 font-medium text-center rounded-xl transition-all duration-200';

  const variantClasses = {
    default: 'bg-white/15 backdrop-blur-sm text-white border border-white/15 hover:bg-white/25',
    primary: 'bg-[#1A46CC] text-white hover:bg-[#163aab] shadow-lg',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15',
    connect: 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white hover:from-indigo-700 hover:to-purple-600 shadow-lg shadow-indigo-500/20',
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:shadow-lg';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
