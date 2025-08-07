import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';

interface LiquidityPool {
  id: string;
  name: string;
  description: string;
  tokenSymbol: string;
  tokenAddress: string;
  lpAddress: string;
  network: string;
  lpType: string;
  walletAddress: string;
  status: string;
  totalLiquidity: number;
  apy: number;
  minInvestment: number;
  maxInvestment: number;
  createdAt: string;
  updatedAt: string;
}

interface LiquidityPoolManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiquidityPoolManager: React.FC<LiquidityPoolManagerProps> = ({
  isOpen,
  onClose
}) => {
  const { address, isConnected } = useWallet();
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Form states for creating new LP
  const [newLP, setNewLP] = useState({
    name: '',
    description: '',
    tokenSymbol: '',
    tokenAddress: '',
    lpAddress: '',
    network: 'ethereum',
    lpType: 'ethereum' as 'base' | 'stellar' | 'ethereum' | 'polygon' | 'arbitrum',
    totalLiquidity: 0,
    apy: 0,
    minInvestment: 0,
    maxInvestment: 0
  });

  useEffect(() => {
    if (isOpen && isConnected && address) {
      // Mock data for development - replace with API call later
      const mockLPs: LiquidityPool[] = [
        {
          id: 'lp-1',
          name: 'Solar Energy Fund',
          description: 'Renewable energy investment tokens for solar projects',
          tokenSymbol: 'SOLAR',
          tokenAddress: '0x1234567890abcdef',
          lpAddress: '0xabcdef1234567890',
          network: 'Ethereum',
          lpType: 'DeFi',
          walletAddress: address || '',
          status: 'active',
          totalLiquidity: 2500000,
          apy: 12.5,
          minInvestment: 100,
          maxInvestment: 100000,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'lp-2',
          name: 'Wind Power Infrastructure',
          description: 'Wind energy infrastructure and development projects',
          tokenSymbol: 'WIND',
          tokenAddress: '0x2345678901bcdef',
          lpAddress: '0xbcdef12345678901',
          network: 'Polygon',
          lpType: 'DeFi',
          walletAddress: address || '',
          status: 'active',
          totalLiquidity: 1800000,
          apy: 15.2,
          minInvestment: 50,
          maxInvestment: 75000,
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T14:30:00Z'
        }
      ];
      
      setLiquidityPools(mockLPs);
      setLoading(false);
    }
  }, [isOpen, isConnected, address]);

  const handleCreateLP = async () => {
    if (!address) return;

    setLoading(true);
    setError('');

    // Mock LP creation - replace with API call later
    setTimeout(() => {
      const mockNewLP: LiquidityPool = {
        id: `lp-${Date.now()}`,
        name: newLP.name,
        description: newLP.description,
        tokenSymbol: newLP.tokenSymbol,
        tokenAddress: newLP.tokenAddress,
        lpAddress: newLP.lpAddress,
        network: newLP.network,
        lpType: newLP.lpType,
        walletAddress: address,
        status: 'active',
        totalLiquidity: newLP.totalLiquidity,
        apy: newLP.apy,
        minInvestment: newLP.minInvestment,
        maxInvestment: newLP.maxInvestment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLiquidityPools([mockNewLP, ...liquidityPools]);
      setShowCreateForm(false);
      setNewLP({
        name: '',
        description: '',
        tokenSymbol: '',
        tokenAddress: '',
        lpAddress: '',
        network: 'ethereum',
        lpType: 'ethereum',
        totalLiquidity: 0,
        apy: 0,
        minInvestment: 0,
        maxInvestment: 0
      });
      setLoading(false);
    }, 1000);
  };

  const getNetworkIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum':
        return '🔷';
      case 'polygon':
        return '🟣';
      case 'base':
        return '🔵';
      case 'stellar':
        return '⭐';
      case 'arbitrum':
        return '🔵';
      default:
        return '🔗';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Liquidity Pool Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!isConnected ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600">Please connect your wallet to manage your liquidity pools.</p>
            </div>
          ) : (
            <>
              {/* Header Actions */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Your Liquidity Pools</h3>
                  <p className="text-sm text-gray-600">
                    Manage your liquidity pools and create new ones
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + New LP
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Create New LP Form */}
              {showCreateForm && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Create New Liquidity Pool</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LP Name *
                      </label>
                      <input
                        type="text"
                        value={newLP.name}
                        onChange={(e) => setNewLP({ ...newLP, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter LP name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token Symbol *
                      </label>
                      <input
                        type="text"
                        value={newLP.tokenSymbol}
                        onChange={(e) => setNewLP({ ...newLP, tokenSymbol: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., SOLAR"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token Address *
                      </label>
                      <input
                        type="text"
                        value={newLP.tokenAddress}
                        onChange={(e) => setNewLP({ ...newLP, tokenAddress: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0x..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LP Address *
                      </label>
                      <input
                        type="text"
                        value={newLP.lpAddress}
                        onChange={(e) => setNewLP({ ...newLP, lpAddress: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0x..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Network *
                      </label>
                      <select
                        value={newLP.network}
                        onChange={(e) => setNewLP({ ...newLP, network: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Select network"
                      >
                        <option value="ethereum">Ethereum</option>
                        <option value="polygon">Polygon</option>
                        <option value="base">Base</option>
                        <option value="stellar">Stellar</option>
                        <option value="arbitrum">Arbitrum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LP Type *
                      </label>
                      <select
                        value={newLP.lpType}
                        onChange={(e) => setNewLP({ ...newLP, lpType: e.target.value as any })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Select LP type"
                      >
                        <option value="ethereum">Ethereum</option>
                        <option value="polygon">Polygon</option>
                        <option value="base">Base</option>
                        <option value="stellar">Stellar</option>
                        <option value="arbitrum">Arbitrum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Liquidity (USD)
                      </label>
                      <input
                        type="number"
                        value={newLP.totalLiquidity}
                        onChange={(e) => setNewLP({ ...newLP, totalLiquidity: parseFloat(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        APY (%)
                      </label>
                      <input
                        type="number"
                        value={newLP.apy}
                        onChange={(e) => setNewLP({ ...newLP, apy: parseFloat(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Investment (USD)
                      </label>
                      <input
                        type="number"
                        value={newLP.minInvestment}
                        onChange={(e) => setNewLP({ ...newLP, minInvestment: parseFloat(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Investment (USD)
                      </label>
                      <input
                        type="number"
                        value={newLP.maxInvestment}
                        onChange={(e) => setNewLP({ ...newLP, maxInvestment: parseFloat(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newLP.description}
                      onChange={(e) => setNewLP({ ...newLP, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter LP description"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateLP}
                      disabled={!newLP.name.trim() || !newLP.tokenSymbol.trim() || !newLP.tokenAddress.trim() || !newLP.lpAddress.trim() || loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Creating...' : 'Create LP'}
                    </button>
                  </div>
                </div>
              )}

              {/* LP List */}
              {liquidityPools.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Liquidity Pools Found</h3>
                  <p className="text-gray-600 mb-4">You haven't created any liquidity pools yet.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First LP
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {liquidityPools.map((lp) => (
                    <div
                      key={lp.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getNetworkIcon(lp.network)}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{lp.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{lp.tokenSymbol}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lp.status)}`}>
                                  {lp.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {lp.description && (
                            <p className="text-sm text-gray-600 mb-3">{lp.description}</p>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Network:</span>
                              <p className="font-medium">{lp.network}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">APY:</span>
                              <p className="font-medium text-green-600">{lp.apy}%</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Total Liquidity:</span>
                              <p className="font-medium">${lp.totalLiquidity.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Investment Range:</span>
                              <p className="font-medium">${lp.minInvestment} - ${lp.maxInvestment.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            <p>Token: {lp.tokenAddress}</p>
                            <p>LP: {lp.lpAddress}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={() => {/* Edit functionality */}}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            onClick={() => {/* Delete functionality */}}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquidityPoolManager; 