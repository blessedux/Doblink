import { useWallet } from '../../hooks/useWallet';
import Button from './Button';

export function ConnectWallet() {
  const { connect, disconnect, isConnected, address } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleClick}
      className="min-w-[140px]"
    >
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
          <svg 
            className="w-4 h-4 ml-1 text-white/70 hover:text-white transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </div>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
} 