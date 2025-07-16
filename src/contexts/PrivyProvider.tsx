import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface WalletContextType {
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

// Create the context with a default value
export const WalletContext = createContext<WalletContextType>({
  address: null,
  connect: () => {},
  disconnect: () => {},
});

// Provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  const connect = () => {
    // For development, set a mock address
    setAddress('0x1234567890abcdef1234567890abcdef12345678');
  };

  const disconnect = () => {
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext); 