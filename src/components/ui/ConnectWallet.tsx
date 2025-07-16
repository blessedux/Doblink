import React from 'react';
import { useWallet } from '../../hooks/useWallet';

const ConnectWallet: React.FC = () => {
  const { address, connect, disconnect } = useWallet();

  return (
    <div>
      {address ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet; 