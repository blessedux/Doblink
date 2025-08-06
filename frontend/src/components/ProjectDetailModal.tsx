import React from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  widget_count: number;
  total_views: number;
  total_revenue: number;
}

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  if (!isOpen || !project) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for POS and marketplaces
  const activePOS = [
    {
      id: 'pos-1',
      name: 'DOB Link Widget',
      type: 'Embedded Widget',
      status: 'active',
      url: '#',
      description: 'Direct token purchase widget'
    },
    {
      id: 'pos-2', 
      name: 'Uniswap V3',
      type: 'DEX',
      status: 'active',
      url: 'https://app.uniswap.org',
      description: 'Decentralized exchange'
    },
    {
      id: 'pos-3',
      name: '1inch Aggregator',
      type: 'Aggregator',
      status: 'active',
      url: 'https://1inch.io',
      description: 'Multi-DEX aggregator'
    }
  ];

  const marketplaces = [
    {
      name: 'Uniswap',
      url: 'https://app.uniswap.org',
      icon: '🦄'
    },
    {
      name: 'SushiSwap',
      url: 'https://sushi.com',
      icon: '🍣'
    },
    {
      name: 'PancakeSwap',
      url: 'https://pancakeswap.finance',
      icon: '🥞'
    },
    {
      name: '1inch',
      url: 'https://1inch.io',
      icon: '1️⃣'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: project.color }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{project.name}</h2>
              <p className="text-gray-400 text-sm">Created {formatDate(project.created_at)}</p>
            </div>
          </div>
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

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Project Overview */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Project Overview</h3>
            <p className="text-gray-300 mb-6">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{project.widget_count}</p>
                <p className="text-gray-400 text-sm">Active Widgets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{project.total_views.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${project.total_revenue.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Active Points of Sale */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Active Points of Sale</h3>
            <div className="space-y-4">
              {activePOS.map((pos) => (
                <div key={pos.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{pos.name}</p>
                      <p className="text-gray-400 text-sm">{pos.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      Active
                    </span>
                    {pos.url !== '#' && (
                      <a
                        href={pos.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3E54D3] hover:text-[#2E44C3] text-sm transition-colors"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplaces & Aggregators */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Available on Marketplaces</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {marketplaces.map((marketplace) => (
                <a
                  key={marketplace.name}
                  href={marketplace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl mb-2">{marketplace.icon}</span>
                  <p className="text-white text-sm font-medium">{marketplace.name}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-white mb-2">Need More Information?</h3>
            <p className="text-gray-400 mb-4">
              Get detailed information about this project's liquidity pool and investment opportunities.
            </p>
            <a
              href="https://home.dobprotocol.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#3E54D3] hover:bg-[#2E44C3] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>View on DOB Protocol</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal; 