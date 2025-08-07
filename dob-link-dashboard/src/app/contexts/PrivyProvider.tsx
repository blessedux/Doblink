import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { privyConfig } from '../config/privy';

interface PrivyProviderProps {
  children: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <BasePrivyProvider
      config={privyConfig}
      appId={import.meta.env.VITE_PRIVY_APP_ID}
    >
      {children}
    </BasePrivyProvider>
  );
} 