import React, { useState } from 'react';
import Button from '../ui/Button';

interface PortfolioInvestment {
  id: string;
  poolName: string;
  assetType: string;
  investedAmount: number;
  currentValue: number;
  apy: number;
  logo: string;
  lockedUntil?: string;
}

interface AgentHolding {
  id: string;
  name: string;
  specialization: string;
  performance: number;
  tokenHoldings: number;
  avatar: string;
}

// Mock portfolio data
const INVESTMENTS: PortfolioInvestment[] = [
  {
    id: 'solar-panels-inv',
    poolName: 'Solar Panel Network',
    assetType: 'Renewable Energy',
    investedAmount: 2500,
    currentValue: 2875,
    apy: 32.5,
    logo: 'https://img.icons8.com/color/96/000000/solar-panel.png',
    lockedUntil: '2024-12-31',
  },
  {
    id: 'ev-charging-inv',
    poolName: 'EV Charging Stations',
    assetType: 'Infrastructure',
    investedAmount: 1000,
    currentValue: 1082,
    apy: 28.2,
    logo: 'https://img.icons8.com/color/96/000000/electric-vehicle.png',
  },
  {
    id: 'iot-sensors-inv',
    poolName: 'Industrial IoT Sensors',
    assetType: 'Industrial Tech',
    investedAmount: 500,
    currentValue: 528.5,
    apy: 29.5,
    logo: 'https://img.icons8.com/color/96/000000/sensor.png',
  },
];

const AGENT_HOLDINGS: AgentHolding[] = [
  {
    id: 'infrastructure-expert',
    name: 'InfraBoost',
    specialization: 'Infrastructure',
    performance: 29.7,
    tokenHoldings: 250,
    avatar: 'https://img.icons8.com/color/96/000000/bot.png',
  },
  {
    id: 'iot-expert',
    name: 'SensorNet',
    specialization: 'IoT Networks',
    performance: 32.8,
    tokenHoldings: 100,
    avatar: 'https://img.icons8.com/color/96/000000/futurama-bender.png',
  },
];

const PortfolioWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'agents'>('overview');
  const [selectedInvestment, setSelectedInvestment] = useState<PortfolioInvestment | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const totalInvested = INVESTMENTS.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalValue = INVESTMENTS.reduce((sum, inv) => sum + inv.currentValue, 0);
  const portfolioGrowth = ((totalValue - totalInvested) / totalInvested) * 100;
  
  const handleWithdraw = (investment: PortfolioInvestment) => {
    setSelectedInvestment(investment);
    setShowWithdrawModal(true);
  };
  
  const handleConfirmWithdraw = () => {
    // In a real app, this would connect to a smart contract
    alert(`Withdrawal of $${withdrawAmount} from ${selectedInvestment?.poolName} initiated!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };
  
  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Portfolio</h2>
        <p className="text-gray-600">
          Manage your investments and monitor the performance of your portfolio
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-gray-100 rounded-xl">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'overview' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'investments' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('investments')}
          >
            Investments
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'agents' ? 'bg-white shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('agents')}
          >
            Agents
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
            <h3 className="font-semibold text-lg mb-4">Portfolio Summary</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Invested</div>
                <div className="font-bold text-xl">${totalInvested.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Current Value</div>
                <div className="font-bold text-xl">${totalValue.toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Portfolio Growth</div>
                <div className={`font-bold ${portfolioGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {portfolioGrowth >= 0 ? '+' : ''}{portfolioGrowth.toFixed(2)}%
                </div>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(Math.max(portfolioGrowth, 0), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Latest Investments</h3>
              {INVESTMENTS.slice(0, 2).map((investment) => (
                <div key={investment.id} className="flex items-center mb-3 last:mb-0">
                  <img src={investment.logo} alt={investment.poolName} className="w-8 h-8 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{investment.poolName}</span>
                      <span className="font-medium">${investment.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{investment.assetType}</span>
                      <span className="text-emerald-600">+{((investment.currentValue - investment.investedAmount) / investment.investedAmount * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="secondary" 
                fullWidth 
                className="mt-4"
                onClick={() => setActiveTab('investments')}
              >
                View All Investments
              </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Your Agents</h3>
              {AGENT_HOLDINGS.slice(0, 2).map((agent) => (
                <div key={agent.id} className="flex items-center mb-3 last:mb-0">
                  <img src={agent.avatar} alt={agent.name} className="w-8 h-8 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{agent.name}</span>
                      <span className="font-medium">{agent.tokenHoldings} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{agent.specialization}</span>
                      <span className="text-emerald-600">+{agent.performance.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="secondary" 
                fullWidth 
                className="mt-4"
                onClick={() => setActiveTab('agents')}
              >
                View All Agents
              </Button>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'investments' && (
        <div>
          {INVESTMENTS.map((investment) => (
            <div key={investment.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-4">
              <div className="flex items-center mb-4">
                <img src={investment.logo} alt={investment.poolName} className="w-10 h-10 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg">{investment.poolName}</h3>
                  <span className="text-sm text-gray-500">{investment.assetType}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Invested Amount</div>
                  <div className="font-bold">${investment.investedAmount.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Current Value</div>
                  <div className="font-bold">${investment.currentValue.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">APY</div>
                  <div className="font-bold text-emerald-600">{investment.apy}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Growth</div>
                  <div className="font-bold text-emerald-600">
                    +${(investment.currentValue - investment.investedAmount).toFixed(2)} 
                    ({((investment.currentValue - investment.investedAmount) / investment.investedAmount * 100).toFixed(2)}%)
                  </div>
                </div>
              </div>
              
              {investment.lockedUntil && (
                <div className="bg-amber-50 p-3 rounded-lg mb-4 border border-amber-100">
                  <div className="flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D97706" strokeWidth="1.5"/>
                      <path d="M12 8V12L14 14" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-amber-800 font-medium">Locked until {new Date(investment.lockedUntil).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleWithdraw(investment)}
                disabled={investment.lockedUntil !== undefined}
              >
                {investment.lockedUntil ? 'Locked' : 'Withdraw Funds'}
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'agents' && (
        <div>
          {AGENT_HOLDINGS.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-4">
              <div className="flex items-center mb-4">
                <img src={agent.avatar} alt={agent.name} className="w-12 h-12 mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <span className="text-sm text-gray-500">{agent.specialization}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Performance</div>
                  <div className="font-bold text-emerald-600">+{agent.performance}%</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Your Holdings</div>
                  <div className="font-bold">{agent.tokenHoldings} tokens</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Portfolio Contribution</h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">Performance boost:</span>
                  <span className="font-medium text-emerald-600">
                    +{(agent.performance * agent.tokenHoldings / 1000).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  fullWidth
                >
                  Buy More Tokens
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                >
                  Manage Assignments
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Withdraw modal */}
      {showWithdrawModal && selectedInvestment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Withdraw from {selectedInvestment.poolName}</h3>
            <div className="mb-4">
              <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  id="withdraw-amount"
                  className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => setWithdrawAmount(selectedInvestment.currentValue.toString())}
                  >
                    Max
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className="text-gray-500">Available:</span>
                <span className="font-medium">${selectedInvestment.currentValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Current investment:</span>
                <span className="font-medium">${selectedInvestment.currentValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">After withdrawal:</span>
                <span className="font-medium">
                  ${(selectedInvestment.currentValue - (parseFloat(withdrawAmount) || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleConfirmWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > selectedInvestment.currentValue}
              >
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWidget; 