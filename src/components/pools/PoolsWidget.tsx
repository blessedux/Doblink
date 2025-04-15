import React, { useState } from 'react';
import Button from '../ui/Button';

interface Pool {
  id: string;
  name: string;
  assetType: string;
  apy: number;
  tvl: string;
  logo: string;
}

// Mock pool data
const POOLS: Pool[] = [
  {
    id: 'solar-panels',
    name: 'Solar Panel Network',
    assetType: 'Renewable Energy',
    apy: 32.5,
    tvl: '$2.4M',
    logo: 'https://img.icons8.com/color/96/000000/solar-panel.png',
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Stations',
    assetType: 'Infrastructure',
    apy: 28.2,
    tvl: '$1.8M',
    logo: 'https://img.icons8.com/color/96/000000/electric-vehicle.png',
  },
  {
    id: 'smart-farming',
    name: 'Smart Farming Network',
    assetType: 'AgriTech',
    apy: 31.7,
    tvl: '$3.2M',
    logo: 'https://img.icons8.com/color/96/000000/farm.png',
  },
  {
    id: 'iot-sensors',
    name: 'Industrial IoT Sensors',
    assetType: 'Industrial Tech',
    apy: 29.5,
    tvl: '$2.1M',
    logo: 'https://img.icons8.com/color/96/000000/sensor.png',
  },
];

const PoolsWidget: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);

  const handleInvest = (pool: Pool) => {
    setSelectedPool(pool);
    setShowInvestModal(true);
  };

  const handleConfirmInvestment = () => {
    // In a real app, this would connect to a smart contract
    alert(`Investment of ${investmentAmount} in ${selectedPool?.name} confirmed!`);
    setShowInvestModal(false);
    setInvestmentAmount('');
  };

  const calculateROI = (amount: string, apy: number) => {
    if (!amount || isNaN(Number(amount))) return '0';
    const investment = parseFloat(amount);
    const yearly = investment * (apy / 100);
    return yearly.toFixed(2);
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">RWA Liquidity Pools</h2>
        <p className="text-gray-600">
          Invest in real-world asset pools backed by physical devices and infrastructure, with an average APY of 30%.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POOLS.map((pool) => (
          <div key={pool.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <img src={pool.logo} alt={pool.name} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="font-semibold text-lg">{pool.name}</h3>
                <span className="text-sm text-gray-500">{pool.assetType}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">APY</div>
                <div className="font-bold text-emerald-600">{pool.apy}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">TVL</div>
                <div className="font-bold">{pool.tvl}</div>
              </div>
            </div>
            <Button 
              variant="primary"
              fullWidth
              onClick={() => handleInvest(pool)}
            >
              Invest in Pool
            </Button>
          </div>
        ))}
      </div>

      {showInvestModal && selectedPool && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Invest in {selectedPool.name}</h3>
            <div className="mb-4">
              <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Investment Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  id="investment-amount"
                  className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Annual Yield (APY):</span>
                <span className="font-medium">{selectedPool.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated yearly return:</span>
                <span className="font-medium text-emerald-600">
                  ${calculateROI(investmentAmount, selectedPool.apy)}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowInvestModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleConfirmInvestment}
                disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
              >
                Confirm Investment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolsWidget; 