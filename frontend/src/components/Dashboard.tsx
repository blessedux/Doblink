import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import WidgetDetailModal from './WidgetDetailModal';
import ProjectDetailModal from './ProjectDetailModal';

interface DashboardProps {
  onShowGuidedWidgetCreation: () => void;
  onShowLiquidityPoolManager: () => void;
  widgets: any[];
  projects: any[];
  stats: any;
  onWidgetUpdate: (widgetId: string, updates: any) => void;
  onWidgetDelete: (widgetId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onShowGuidedWidgetCreation,
  onShowLiquidityPoolManager,
  widgets,
  projects,
  stats,
  onWidgetUpdate,
  onWidgetDelete
}) => {
  const { address, isConnected } = useWallet();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('widgets');
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [showWidgetDetail, setShowWidgetDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  const handleSidebarMouseEnter = () => {
    setSidebarOpen(true);
  };

  const handleSidebarMouseLeave = () => {
    setSidebarOpen(false);
  };

  const handleWidgetClick = (widget: any) => {
    setSelectedWidget(widget);
    setShowWidgetDetail(true);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleWidgetUpdate = (widgetId: string, updates: any) => {
    onWidgetUpdate(widgetId, updates);
    
    // Update the selectedWidget state if it's the same widget
    if (selectedWidget && selectedWidget.id === widgetId) {
      setSelectedWidget({ ...selectedWidget, ...updates });
    }
  };

  const handleWidgetDelete = (widgetId: string) => {
    onWidgetDelete(widgetId);
  };

  const navigationItems = [
    { 
      id: 'widgets', 
      name: 'Widgets', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      count: widgets.length 
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ), 
      count: projects.length 
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ), 
      count: null 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
      count: null 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'paused':
        return 'text-yellow-400';
      case 'inactive':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'paused':
        return '⏸️';
      case 'inactive':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/doblink_logo.png" 
                alt="DOB Link" 
                className="h-8 w-auto"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div 
          className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 h-full ${
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        >
          <nav className="p-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-colors hover:bg-gray-700 ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.count !== null && (
                      <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Top Section with CTA - Only show on widgets and projects pages */}
          {(activeTab === 'widgets' || activeTab === 'projects') && (
            <div className="flex items-center justify-end mb-8">
              {activeTab === 'widgets' ? (
                <button
                  onClick={onShowGuidedWidgetCreation}
                  className="bg-[#3E54D3] hover:bg-[#2E44C3] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Widget</span>
                </button>
              ) : (
                <a
                  href="https://home.dobprotocol.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3E54D3] hover:bg-[#2E44C3] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Manage LP</span>
                </a>
              )}
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'widgets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  onClick={() => handleWidgetClick(widget)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">{widget.token_id}</h3>
                      <p className="text-sm text-gray-400">{widget.hash}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${
                      widget.is_active ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-sm text-gray-400">
                      {widget.is_active ? 'Widget is active' : 'Widget is inactive'}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Views:</span>
                      <p className="text-white font-medium">{widget.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Revenue:</span>
                      <p className="text-white font-medium">${widget.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Liquidity Pools</h2>
                <p className="text-gray-400">View your liquidity pools and create widgets to sell tokens</p>
              </div>

              {/* Projects Grid */}
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleProjectClick(project)}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">{project.name}</h3>
                          <p className="text-sm text-gray-400">{project.description}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-sm text-gray-400">LP Active</span>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Widgets:</span>
                          <p className="text-white font-medium">{project.widget_count}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Revenue:</span>
                          <p className="text-white font-medium">${project.total_revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State with Troubleshooting */
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No Liquidity Pools Found</h3>
                  <p className="text-gray-400 mb-6">
                    We couldn't find any liquidity pools linked to your wallet address. 
                    This could be because:
                  </p>
                  
                  <div className="text-left max-w-md mx-auto space-y-3 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-400">Your wallet isn't connected to the correct network</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-400">The LP was created with a different wallet address</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-400">The LP hasn't been registered in our system yet</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Get Help</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Analytics Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Active Widgets</p>
                    <p className="text-2xl font-bold text-white">{widgets.filter(w => w.is_active).length}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Widgets</p>
                    <p className="text-2xl font-bold text-white">{widgets.length}</p>
                  </div>
                </div>
              </div>

              {/* Widget Analytics Table */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Widget Performance</h3>
                {widgets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Widget</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Views</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Conversions</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Tokens Sold</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {widgets.map((widget) => (
                          <tr key={widget.id} className="border-b border-gray-700 hover:bg-gray-750">
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-white font-medium">{widget.token_id}</p>
                                <p className="text-gray-400 text-sm">{widget.hash}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  widget.is_active ? 'bg-green-400' : 'bg-red-400'
                                }`}></div>
                                <span className={`text-sm ${
                                  widget.is_active ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {widget.is_active ? 'Active' : 'Paused'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-white">{widget.views.toLocaleString()}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-white">${widget.revenue.toLocaleString()}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-white">{widget.conversions}%</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-white">{widget.tokens_sold.toLocaleString()}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-white font-mono text-sm bg-gray-700 px-2 py-1 rounded">
                                {widget.token_id.substring(0, 3).toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Widgets Found</h3>
                    <p className="text-gray-400 mb-4">
                      You haven't created any widgets yet. Create your first widget to see analytics data.
                    </p>
                    <button
                      onClick={onShowGuidedWidgetCreation}
                      className="bg-[#3E54D3] hover:bg-[#2E44C3] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Create Widget
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}



          {activeTab === 'settings' && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Settings</h3>
              <p className="text-gray-400">Configure your account and application settings.</p>
            </div>
          )}
        </div>
      </div>

      {/* Widget Detail Modal */}
      <WidgetDetailModal
        isOpen={showWidgetDetail}
        onClose={() => {
          setShowWidgetDetail(false);
          setSelectedWidget(null);
        }}
        widget={selectedWidget}
        onWidgetUpdate={handleWidgetUpdate}
        onWidgetDelete={handleWidgetDelete}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={showProjectDetail}
        onClose={() => {
          setShowProjectDetail(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
    </div>
  );
};

export default Dashboard; 