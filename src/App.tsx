import React from 'react';
import DobLinkWidget from './components/DobLinkWidget';

const App: React.FC = () => {
  const token = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'E-Hive EV Charger',
    logo: '/Ehive-logo.png',
    apy: 18.7,
  };

  return (
    <div>
      <h1>DOBLINK Embeddable Widget</h1>
      <DobLinkWidget token={token} theme="light" showPortfolio={false} />
    </div>
  );
};

export default App; 