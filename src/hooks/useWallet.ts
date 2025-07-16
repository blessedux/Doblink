import { useContext } from 'react';
import { WalletContext } from '../contexts/PrivyProvider';

export const useWallet = () => useContext(WalletContext); 