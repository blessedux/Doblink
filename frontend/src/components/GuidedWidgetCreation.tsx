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

interface Widget {
  hash: string;
  tokenId: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  projectId: string;
  lpId: string;
  embedCode: string;
  activeLinks: number;
  tokensSold: number;
  views: number;
  conversions: number;
  revenue: number;
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
}

interface GuidedWidgetCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onWidgetCreated: (widget: Widget) => void;
}

const GuidedWidgetCreation: React.FC<GuidedWidgetCreationProps> = ({
  isOpen,
  onClose,
  onWidgetCreated
}) => {
  const { address } = useWallet();
  const [currentStep, setCurrentStep] = useState<'select-lp' | 'create-widget' | 'complete'>('select-lp');
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [selectedLP, setSelectedLP] = useState<LiquidityPool | null>(null);
  const [createdWidget, setCreatedWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Form states
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [preferredCurrency, setPreferredCurrency] = useState('USD');
  const [showColorWheel, setShowColorWheel] = useState(false);
  const [selectedColorType, setSelectedColorType] = useState<'green' | 'blue' | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Mock data for development - replace with API call later
      const mockLPs: LiquidityPool[] = [
        {
          id: 'lp-1',
          name: 'E-Hive EV Charger',
          description: 'Electric vehicle charging infrastructure investment',
          tokenSymbol: 'EHIVE',
          tokenAddress: '0x1234567890abcdef',
          lpAddress: '0xabcdef1234567890',
          network: 'Ethereum',
          lpType: 'DeFi',
          walletAddress: address || '',
          status: 'active',
          totalLiquidity: 2500000,
          apy: 18.7,
          minInvestment: 100,
          maxInvestment: 100000,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'lp-2',
          name: 'Solar Energy Fund',
          description: 'Renewable energy investment tokens for solar projects',
          tokenSymbol: 'SOLAR',
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
      setCurrentStep('select-lp');
    }
  }, [isOpen, address]);

  const handleLPSelection = (lp: LiquidityPool) => {
    setSelectedLP(lp);
    setCurrentStep('create-widget');
  };

  const handleWidgetCreation = async () => {
    if (!selectedLP) {
      setError('Please select a liquidity pool');
      return;
    }

    setLoading(true);
    setError('');

    // Mock widget creation - replace with API call later
    setTimeout(() => {
      const mockWidget: Widget = {
        hash: `dob-${selectedLP.tokenSymbol.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`,
        tokenId: selectedLP.tokenSymbol,
        theme: 'light',
        position: 'bottom-right',
        projectId: `proj-${Date.now()}`,
        lpId: selectedLP.id,
        embedCode: `<script src="https://dobprotocol.com/link.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: '${selectedLP.tokenSymbol}',\n    backgroundColor: '${backgroundColor}',\n    preferredCurrency: '${preferredCurrency}',\n    hash: 'dob-${selectedLP.tokenSymbol.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}'\n  }).mount();\n</script>`,
        activeLinks: 0,
        tokensSold: 0,
        views: 0,
        conversions: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true
      };

      setCreatedWidget(mockWidget);
      setCurrentStep('complete');
      setLoading(false);
    }, 1000);
  };

  const resetFlow = () => {
    setCurrentStep('select-lp');
    setLiquidityPools([]);
    setSelectedLP(null);
    setCreatedWidget(null);
    setBackgroundColor('#FFFFFF');
    setPreferredCurrency('USD');
    setShowColorWheel(false);
    setSelectedColorType(null);
    setError('');
  };

  const copyEmbedCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create New Widget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-center space-x-8">
            {[
              { key: 'select-lp', label: 'Select LP', icon: '💧' },
              { key: 'create-widget', label: 'Configure Widget', icon: '🎯' },
              { key: 'complete', label: 'Complete', icon: '✅' }
            ].map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.key
                    ? 'bg-[#3E54D3] text-white'
                    : index < ['select-lp', 'create-widget', 'complete'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep === step.key ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < ['select-lp', 'create-widget', 'complete'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Step 1: Select Liquidity Pool */}
          {currentStep === 'select-lp' && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Select a Liquidity Pool</h3>
              <p className="text-gray-400 mb-6">
                Choose the liquidity pool you want to create a widget for:
              </p>
              
              <div className="grid gap-4">
                {liquidityPools.map((lp) => (
                  <div
                    key={lp.id}
                    onClick={() => handleLPSelection(lp)}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-[#3E54D3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{lp.name}</h4>
                        <p className="text-gray-400 text-sm">{lp.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-400">Token: {lp.tokenSymbol}</span>
                          <span className="text-gray-400">Network: {lp.network}</span>
                          <span className="text-green-400">APY: {lp.apy}%</span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configure Widget */}
          {currentStep === 'create-widget' && selectedLP && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Configure Widget</h3>
                <p className="text-gray-400 mb-6">
                  Customize your widget for: <strong className="text-white">{selectedLP.name}</strong>
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Currency
                    </label>
                    <select
                      value={preferredCurrency}
                      onChange={(e) => setPreferredCurrency(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3E54D3]"
                      aria-label="Select preferred currency"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex space-x-3">
                      {[
                        { color: '#000000', name: 'Black' },
                        { color: '#22C55E', name: 'Green', type: 'green' as const },
                        { color: '#3B82F6', name: 'Blue', type: 'blue' as const },
                        { color: '#6B7280', name: 'Grey' },
                        { color: '#FFFFFF', name: 'White' }
                      ].map((option) => (
                        <button
                          key={option.color}
                          onClick={() => setBackgroundColor(option.color)}
                          onDoubleClick={() => {
                            if (option.type) {
                              setSelectedColorType(option.type);
                              setShowColorWheel(true);
                            }
                          }}
                          className={`w-10 h-10 rounded-full border-2 transition-colors ${
                            backgroundColor === option.color ? 'border-[#3E54D3]' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: option.color }}
                          title={`Select ${option.name} background color (double-click for hue adjustment)`}
                          aria-label={`Select ${option.name} background color (double-click for hue adjustment)`}
                        />
                      ))}
                    </div>
                    
                    {/* Color Wheel Modal */}
                    {showColorWheel && selectedColorType && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-white">
                              Adjust {selectedColorType.charAt(0).toUpperCase() + selectedColorType.slice(1)} Hue
                            </h3>
                            <button
                              onClick={() => {
                                setShowColorWheel(false);
                                setSelectedColorType(null);
                              }}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Close color wheel"
                              aria-label="Close color wheel"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 mb-6">
                            {(selectedColorType === 'green' ? [
                              { color: '#16A34A', name: 'Forest Green' },
                              { color: '#22C55E', name: 'Green' },
                              { color: '#4ADE80', name: 'Light Green' },
                              { color: '#84CC16', name: 'Lime Green' },
                              { color: '#A3E635', name: 'Yellow Green' },
                              { color: '#65A30D', name: 'Olive Green' }
                            ] : [
                              { color: '#1E40AF', name: 'Navy Blue' },
                              { color: '#3B82F6', name: 'Blue' },
                              { color: '#60A5FA', name: 'Light Blue' },
                              { color: '#0EA5E9', name: 'Sky Blue' },
                              { color: '#06B6D4', name: 'Cyan Blue' },
                              { color: '#6366F1', name: 'Indigo Blue' }
                            ]).map((hueOption) => (
                              <button
                                key={hueOption.color}
                                onClick={() => {
                                  setBackgroundColor(hueOption.color);
                                  setShowColorWheel(false);
                                  setSelectedColorType(null);
                                }}
                                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                                title={`Select ${hueOption.name} hue`}
                                aria-label={`Select ${hueOption.name} hue`}
                              >
                                <div
                                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                                  style={{ backgroundColor: hueOption.color }}
                                />
                                <span className="text-xs text-gray-300 text-center">{hueOption.name}</span>
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setShowColorWheel(false);
                                setSelectedColorType(null);
                              }}
                              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={() => setCurrentStep('select-lp')}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleWidgetCreation}
                    disabled={loading}
                    className="bg-[#3E54D3] hover:bg-[#2E44C3] disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Widget</span>
                    )}
                  </button>
                </div>
              </div>

                             {/* Widget Preview */}
               <div>
                 <h3 className="text-lg font-medium text-white mb-4">Widget Preview</h3>
                 <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                   <div 
                     className="rounded-lg p-4 shadow-lg"
                     style={{ backgroundColor }}
                   >
                     <div className="grid grid-cols-2 gap-4 mb-4">
                       {/* Left Column */}
                       <div className="space-y-4">
                         <div>
                           <div className="h-4 bg-gray-300 rounded mb-2"></div>
                           <div className="bg-gray-200 rounded-lg p-3 flex items-center space-x-2">
                             <div className="w-6 h-6 bg-gray-400 rounded"></div>
                             <div className="h-4 bg-gray-300 rounded flex-1"></div>
                             <div className="w-4 h-4 bg-gray-400 rounded"></div>
                           </div>
                         </div>
                         <div>
                           <div className="h-4 bg-gray-300 rounded mb-2"></div>
                           <div className="h-8 bg-gray-200 rounded"></div>
                         </div>
                       </div>

                       {/* Right Column */}
                       <div className="space-y-4">
                         <div className="flex items-center space-x-2">
                           <div className="w-6 h-6 bg-gray-400 rounded"></div>
                           <div className="h-4 bg-gray-300 rounded flex-1"></div>
                           <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                         </div>
                         <div>
                           <div className="h-8 bg-gray-200 rounded"></div>
                           <div className="h-3 bg-gray-300 rounded mt-1"></div>
                         </div>
                         <div>
                           <div className="h-6 bg-gray-200 rounded"></div>
                           <div className="h-3 bg-gray-300 rounded mt-1"></div>
                         </div>
                       </div>
                     </div>
                     
                     {/* Invest Button */}
                     <div className="w-full h-12 bg-gray-400 rounded-lg"></div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 'complete' && createdWidget && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Widget Created Successfully!</h3>
                <p className="text-gray-400">
                  Your widget is ready to be embedded on your website.
                </p>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-2">Widget Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Token ID:</span>
                    <p className="text-white">{createdWidget.tokenId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Widget Hash:</span>
                    <p className="text-white font-mono text-xs">{createdWidget.hash}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Background Color:</span>
                    <p className="text-white">{backgroundColor}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Currency:</span>
                    <p className="text-white">{preferredCurrency}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Embed Code</h4>
                  <button
                    onClick={() => copyEmbedCode(createdWidget.embedCode)}
                    className={`text-sm transition-all duration-200 ${
                      copyFeedback 
                        ? 'text-green-400 scale-105' 
                        : 'text-[#3E54D3] hover:text-[#2E44C3]'
                    }`}
                  >
                    {copyFeedback ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                  {createdWidget.embedCode}
                </pre>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    onWidgetCreated(createdWidget);
                    onClose();
                  }}
                  className="bg-[#3E54D3] hover:bg-[#2E44C3] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidedWidgetCreation; 