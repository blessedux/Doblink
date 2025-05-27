import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/ui/Navbar';
import Button from './components/ui/Button';
import BackgroundGradient from './components/ui/BackgroundGradient';
import FarmWidget from './components/farm/FarmWidget';
import { PrivyProvider } from './contexts/PrivyProvider';

// Simple mock components
const PoolsWidget: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-white mb-4">Liquidity Pools</h2>
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-4">
        <p className="text-white/80">Provide liquidity to earn trading fees and rewards.</p>
      </div>
    </div>
  );
};

const AgentsWidget: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-white mb-4">AI Agents Dashboard</h2>
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-4">
        <p className="text-white/80">AI agents that optimize your portfolio are coming soon.</p>
      </div>
    </div>
  );
};

const PortfolioWidget: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-medium text-white mb-4">Your Portfolio</h2>
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-4">
        <p className="text-white/80">A comprehensive view of your holdings will appear here.</p>
      </div>
    </div>
  );
};

// Agent data for assistant feature
const AGENTS = [
  {
    id: 'yield-optimizer',
    name: 'YieldMax AI',
    logo: 'https://img.icons8.com/color/96/000000/artificial-intelligence.png',
    strategy: 'Optimizes yield across infrastructure tokens with focus on sustainable energy assets.',
    performance: 12.4,
    status: 'active' as const,
    managedTokens: ['SOLAR', 'EVCH', 'WIFI', 'FARM'],
  }
];

const AGENT_MESSAGES = [
  { message: 'Solar Panel Network is performing well today', token: 'SOLAR' },
  { message: 'Consider investing in renewable energy tokens', token: undefined },
  { message: 'EV Charging Network is trending upward', token: 'EVCH' },
  { message: 'I\'ve detected a positive pattern in', token: 'FARM' },
  { message: 'Infrastructure tokens are outperforming the market', token: undefined },
];

interface AgentInfo {
  id: string;
  name: string;
  logo: string;
  strategy: string;
  performance: number;
  status: 'active' | 'idle' | 'optimizing';
  managedTokens: string[];
}

interface AgentSuggestion {
  id: string;
  message: string;
  token?: string;
  timestamp: number;
  visible: boolean;
}

type TabType = 'farm' | 'pools' | 'agents' | 'portfolio';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('farm');
  const [activeAgent, setActiveAgent] = useState<AgentInfo>(AGENTS[0]);
  const [showAgentMonitor, setShowAgentMonitor] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<AgentSuggestion | null>(null);
  const [suggestionState, setSuggestionState] = useState<'appearing' | 'visible' | 'disappearing' | 'hidden'>('hidden');
  const [isAgentHovered, setIsAgentHovered] = useState(false);
  
  // Reference to timeout for cleanup - using number type which is compatible with browser setTimeout
  const suggestionTimeoutRef = useRef<number | null>(null);
  const suggestionAnimationRef = useRef<number | null>(null);
  
  // Generate agent suggestions
  useEffect(() => {
    const createSuggestion = () => {
      // Only create a new suggestion if there isn't one already or if it's disappearing/hidden
      if (!currentSuggestion || suggestionState === 'disappearing' || suggestionState === 'hidden') {
        const randomMessage = AGENT_MESSAGES[Math.floor(Math.random() * AGENT_MESSAGES.length)];
        const newSuggestion: AgentSuggestion = {
          id: Date.now().toString(),
          message: randomMessage.message,
          token: randomMessage.token,
          timestamp: Date.now(),
          visible: true,
        };
        
        // Set to appearing state
        setCurrentSuggestion(newSuggestion);
        setSuggestionState('appearing');
        
        // After a brief delay for the appear animation, set to visible
        suggestionAnimationRef.current = window.setTimeout(() => {
          setSuggestionState('visible');
          
          // Set timer to start disappearing
          suggestionAnimationRef.current = window.setTimeout(() => {
            setSuggestionState('disappearing');
            
            // After disappearing animation, hide completely
            suggestionAnimationRef.current = window.setTimeout(() => {
              setSuggestionState('hidden');
            }, 500);
          }, 4000); // Show for 4 seconds
        }, 300); // Appear animation takes 300ms
      }
    };
    
    // First suggestion after a slight delay
    suggestionTimeoutRef.current = window.setTimeout(createSuggestion, 2000);
    
    // Create a new suggestion every 7-9 seconds
    const interval = window.setInterval(() => {
      createSuggestion();
    }, 7000 + Math.random() * 2000);
    
    return () => {
      // Clean up all timeouts and intervals
      clearInterval(interval);
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      if (suggestionAnimationRef.current) {
        clearTimeout(suggestionAnimationRef.current);
      }
    };
  }, [currentSuggestion, suggestionState]);

  return (
    <PrivyProvider>
      <BackgroundGradient className="min-h-screen flex flex-col">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-black/20 backdrop-blur-sm rounded-2xl shadow-xl">
            {activeTab === 'farm' && <FarmWidget />}
            {activeTab === 'pools' && <PoolsWidget />}
            {activeTab === 'agents' && <AgentsWidget />}
            {activeTab === 'portfolio' && <PortfolioWidget />}
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-white/40">
          DOB Protocol
        </footer>
        
        {/* Agent Avatar Button with Thought Bubble */}
        <div className="fixed bottom-4 left-4 z-40">
          <div className="relative">
            {/* Agent Thought Bubble */}
            {currentSuggestion && suggestionState !== 'hidden' && (
              <div 
                className={`absolute bottom-full mb-2 left-0 transition-all duration-500 ease-in-out transform 
                ${suggestionState === 'appearing' ? 'opacity-0 translate-y-2 scale-95' : 
                  suggestionState === 'visible' ? 'opacity-100 translate-y-0 scale-100' : 
                  'opacity-0 translate-y-0 scale-100'}`}
              >
                <div className="relative max-w-xs backdrop-blur-sm">
                  <div className="bg-white/90 text-black p-2.5 pr-3.5 rounded-xl rounded-bl-none shadow-lg text-sm">
                    {currentSuggestion.message}
                    {currentSuggestion.token && (
                      <span className="text-indigo-600 font-medium ml-1">${currentSuggestion.token}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1.5 left-2.5 w-4 h-4 bg-white/90 rounded-sm transform rotate-45"></div>
                </div>
              </div>
            )}

            {/* Agent Avatar Button */}
            <button 
              onClick={() => setShowAgentMonitor(true)}
              onMouseEnter={() => setIsAgentHovered(true)}
              onMouseLeave={() => setIsAgentHovered(false)}
              className={`relative rounded-full p-3 shadow-lg transition-all duration-300 ${
                isAgentHovered || (currentSuggestion && suggestionState === 'visible')
                  ? 'bg-indigo-600/80 backdrop-blur-xl'
                  : 'bg-black/50 backdrop-blur-xl border border-indigo-500/20'
              }`}
            >
              <div className="relative">
                <img src={activeAgent.logo} alt="Agent" className="w-6 h-6" />
                <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                  activeAgent.status === 'active' ? 'bg-emerald-400' : 
                  activeAgent.status === 'optimizing' ? 'bg-amber-400' : 'bg-white/50'
                } ring-1 ring-black`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Full Agent Monitor (when clicked) */}
        {showAgentMonitor && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="relative bg-black/60 backdrop-blur-xl border border-indigo-500/30 rounded-xl max-w-md w-full mx-4 p-5 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img src={activeAgent.logo} alt={activeAgent.name} className="w-7 h-7 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-white">{activeAgent.name}</h3>
                    <div className="flex items-center text-xs">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        activeAgent.status === 'active' ? 'bg-emerald-400' : 
                        activeAgent.status === 'optimizing' ? 'bg-amber-400' : 'bg-white/50'
                      }`}></div>
                      <span className="text-white/70 capitalize">{activeAgent.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAgentMonitor(false)}
                  className="text-white/70 hover:text-white"
                  type="button"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-3 bg-black/30 backdrop-blur-md rounded-lg mb-4">
                <p className="text-white/90 text-sm">{activeAgent.strategy}</p>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/80">Portfolio Performance</span>
                  <span className="text-emerald-400 font-medium">+{activeAgent.performance}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500" style={{ width: `${activeAgent.performance * 2}%` }}></div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">Managing Tokens</div>
                <div className="flex flex-wrap gap-2">
                  {activeAgent.managedTokens.map((symbol: string) => (
                    <div key={symbol} className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-white/90 flex items-center">
                      {symbol}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-indigo-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-white font-medium">Recent Agent Activity</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="text-white/80 flex">
                    <span className="text-white/50 mr-2">•</span>
                    Rebalanced portfolio for optimal yield spread
                  </li>
                  <li className="text-white/80 flex">
                    <span className="text-white/50 mr-2">•</span>
                    Analyzed 32 infrastructure tokens in the last 24h
                  </li>
                  <li className="text-white/80 flex">
                    <span className="text-white/50 mr-2">•</span>
                    Detected positive trend in renewable energy sector
                  </li>
                </ul>
              </div>
              
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowAgentMonitor(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </BackgroundGradient>
    </PrivyProvider>
  );
}

export default App;
