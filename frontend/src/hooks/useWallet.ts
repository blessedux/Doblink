import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback } from 'react';

export function useWallet() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  const connect = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [login]);

  const disconnect = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, [logout]);

  const getWalletAddress = useCallback(() => {
    if (!wallets.length) return null;
    return wallets[0].address;
  }, [wallets]);

  return {
    connect,
    disconnect,
    isConnected: authenticated,
    isReady: ready,
    address: getWalletAddress(),
    wallets,
  };
} 