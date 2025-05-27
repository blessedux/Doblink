import { PrivyClientConfig } from '@privy-io/react-auth';
import { mainnet } from 'viem/chains';

export const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: 'dark',
    accentColor: '#6366f1', // Indigo color to match our theme
    showWalletLoginFirst: true,
  },
  loginMethods: ['email', 'wallet', 'google', 'discord'],
  embeddedWallets: {
    createOnLogin: 'all-users',
  },
  defaultChain: mainnet,
  supportedChains: [mainnet], // Add more chains as needed
}; 