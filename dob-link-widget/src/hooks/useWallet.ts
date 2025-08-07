import { useEffect, useState } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function fetchAddress() {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          } else {
            setAddress(null);
            setIsConnected(false);
          }
        } catch (err) {
          setAddress(null);
          setIsConnected(false);
        }
      }
    }
    fetchAddress();

    // Listen for account changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        setAddress(accounts[0] || null);
        setIsConnected(accounts.length > 0);
      });
    }
  }, []);

  const connect = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  return { address, isConnected, connect, disconnect };
} 