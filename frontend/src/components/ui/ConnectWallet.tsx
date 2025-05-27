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
        </div>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
} 