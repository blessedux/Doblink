import React, { useState } from 'react';
import Button from '../ui/Button';

interface Agent {
  id: string;
  name: string;
  specialization: string;
  performance: number; // percentage
  fee: number; // percentage
  description: string;
  holdings: number; // tokens owned
  avatar: string;
  isOwned: boolean;
}

// Mock agent data
const AGENTS: Agent[] = [
  {
    id: 'solar-expert',
    name: 'SolarYield',
    specialization: 'Renewable Energy',
    performance: 34.2,
    fee: 2.5,
    description: 'Specialized in optimizing yields from solar panel infrastructure investments.',
    holdings: 0,
    avatar: 'https://img.icons8.com/color/96/000000/artificial-intelligence.png',
    isOwned: true,
  },
  {
    id: 'infrastructure-expert',
    name: 'InfraBoost',
    specialization: 'Infrastructure',
    performance: 29.7,
    fee: 2.0,
    description: 'Focused on maximizing returns from infrastructure investments like EV charging networks.',
    holdings: 250,
    avatar: 'https://img.icons8.com/color/96/000000/bot.png',
    isOwned: true,
  },
  {
    id: 'agritech-expert',
    name: 'HarvestPrime',
    specialization: 'AgriTech',
    performance: 31.5,
    fee: 2.2,
    description: 'Expert in agricultural technology investments with focus on sustainable farming solutions.',
    holdings: 0,
    avatar: 'https://img.icons8.com/color/96/000000/robot-2.png',
    isOwned: false,
  },
  {
    id: 'iot-expert',
    name: 'SensorNet',
    specialization: 'IoT Networks',
    performance: 32.8,
    fee: 2.3,
    description: 'Specializes in IoT sensor networks and data-driven industrial automation systems.',
    holdings: 100,
    avatar: 'https://img.icons8.com/color/96/000000/futurama-bender.png',
    isOwned: false,
  },
];

const AgentsWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'owned' | 'marketplace'>('owned');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState('');
  
  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailModal(true);
  };
  
  const handleEmployAgent = () => {
    // In a real app, this would connect to a smart contract to purchase agent tokens
    alert(`Successfully acquired ${tokenAmount} tokens of ${selectedAgent?.name}`);
    setShowDetailModal(false);
    setTokenAmount('');
  };
  
  const ownedAgents = AGENTS.filter(agent => agent.isOwned || agent.holdings > 0);
  const marketplaceAgents = AGENTS.filter(agent => !agent.isOwned);
  
  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Investment Agents</h2>
        <p className="text-gray-600">
          Employ specialized AI agents to manage your portfolio and optimize your investment strategy.
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-gray-100 rounded-xl">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'owned' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('owned')}
          >
            My Agents
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'marketplace' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('marketplace')}
          >
            Agent Marketplace
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeTab === 'owned' ? ownedAgents : marketplaceAgents).map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <img src={agent.avatar} alt={agent.name} className="w-12 h-12 mr-4" />
              <div>
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <span className="text-sm text-gray-500">{agent.specialization}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Performance</div>
                <div className="font-bold text-emerald-600">+{agent.performance}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Fee</div>
                <div className="font-bold">{agent.fee}%</div>
              </div>
            </div>
            
            {activeTab === 'owned' && agent.holdings > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm text-gray-500">Your Holdings</div>
                <div className="font-bold">{agent.holdings} tokens</div>
              </div>
            )}
            
            <Button 
              variant="primary"
              fullWidth
              onClick={() => handleViewAgent(agent)}
            >
              {activeTab === 'marketplace' ? 'Employ Agent' : 'View Details'}
            </Button>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {activeTab === 'owned' && ownedAgents.length === 0 && (
        <div className="text-center py-8">
          <img 
            src="https://img.icons8.com/clouds/100/000000/artificial-intelligence.png" 
            alt="No agents" 
            className="mx-auto mb-4 w-20 h-20 opacity-50"
          />
          <h3 className="text-lg font-medium mb-2">No agents yet</h3>
          <p className="text-gray-500 mb-4">You haven't employed any agents to manage your portfolio</p>
          <Button variant="primary" onClick={() => setActiveTab('marketplace')}>
            Explore Agent Marketplace
          </Button>
        </div>
      )}
      
      {/* Agent detail modal */}
      {showDetailModal && selectedAgent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              <img src={selectedAgent.avatar} alt={selectedAgent.name} className="w-12 h-12 mr-4" />
              <div>
                <h3 className="text-xl font-bold">{selectedAgent.name}</h3>
                <span className="text-sm text-gray-500">{selectedAgent.specialization}</span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              {selectedAgent.description}
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Performance</div>
                <div className="font-bold text-emerald-600">+{selectedAgent.performance}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Fee</div>
                <div className="font-bold">{selectedAgent.fee}%</div>
              </div>
            </div>
            
            {activeTab === 'owned' ? (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Agent Holdings</h4>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Your tokens:</span>
                  <span className="font-medium">{selectedAgent.holdings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Portfolio contribution:</span>
                  <span className="font-medium text-emerald-600">
                    +{(selectedAgent.performance * selectedAgent.holdings / 1000).toFixed(2)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label htmlFor="token-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Token Amount to Purchase
                </label>
                <input
                  type="text"
                  id="token-amount"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Each token represents a share of the agent's expertise in your portfolio
                </p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
              {activeTab === 'marketplace' && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleEmployAgent}
                  disabled={!tokenAmount || parseFloat(tokenAmount) <= 0}
                >
                  Employ Agent
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsWidget; 