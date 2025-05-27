import type React from 'react';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen w-full bg-white ${className}`}>
      {children}
    </div>
  );
};

export default BackgroundGradient; 