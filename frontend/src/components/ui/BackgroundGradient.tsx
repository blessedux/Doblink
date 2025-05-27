import React, { useEffect, useState } from 'react';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ 
  children,
  className = "",
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden bg-gray-950 ${className}`}>
      <div 
        className="absolute inset-0 w-full h-full blur-3xl opacity-15"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(93, 52, 255, 0.5),
            rgba(255, 255, 255, 0.3), 
            rgba(102, 75, 218, 0.2)
          )`,
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        }}
      />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/20 via-transparent to-black/20" />
      <div className="animate-gradient-shift absolute inset-0 w-full h-full opacity-15" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundGradient; 