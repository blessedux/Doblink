import { useState } from 'react';
import Navbar from './components/ui/Navbar';
import FarmWidget from './components/farm/FarmWidget';
import PoolsWidget from './components/pools/PoolsWidget';
import AgentsWidget from './components/agents/AgentsWidget';
import PortfolioWidget from './components/portfolio/PortfolioWidget';

type TabType = 'farm' | 'pools' | 'agents' | 'portfolio';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('farm');

  return (
    <div className="min-h-screen flex flex-col uniswap-gradient">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex items-center justify-center p-4">
        {activeTab === 'farm' && <FarmWidget />}
        {activeTab === 'pools' && <PoolsWidget />}
        {activeTab === 'agents' && <AgentsWidget />}
        {activeTab === 'portfolio' && <PortfolioWidget />}
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        <p>DobSwap - Powered by DOB Protocol</p>
      </footer>
    </div>
  );
}

export default App;
