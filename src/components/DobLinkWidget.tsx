import React from 'react';
import { WalletProvider } from '../contexts/PrivyProvider';
import ConnectWallet from './ui/ConnectWallet';

interface DobLinkWidgetProps {
  token: {
    address: string;
    name: string;
    logo: string;
    apy: number;
  };
  theme?: 'light' | 'dark';
  showPortfolio?: boolean;
}

const DobLinkWidget: React.FC<DobLinkWidgetProps> = ({ token, theme = 'light', showPortfolio = false }) => {
  return (
    <WalletProvider>
      <div style={{ background: theme === 'light' ? 'white' : '#333', padding: '20px', borderRadius: '8px' }}>
        <h2>{token.name}</h2>
        <img src={token.logo} alt={token.name} style={{ width: '50px', height: '50px' }} />
        <p>APY: {token.apy}%</p>
        <ConnectWallet />
        <button onClick={() => alert('Buy/Sell functionality will be integrated here.')}>Buy/Sell Tokens</button>
        {showPortfolio && (
          <div>
            <h3>Portfolio</h3>
            <p>Your holdings will be displayed here.</p>
          </div>
        )}
      </div>
    </WalletProvider>
  );
};

export default DobLinkWidget; 