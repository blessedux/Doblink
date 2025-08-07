import React, { useState } from 'react';

interface Widget {
  id: string;
  token_id: string;
  hash: string;
  is_active: boolean;
  views: number;
  revenue: number;
  active_links: number;
  tokens_sold: number;
  conversions: number;
  created_at: string;
  embed_code?: string;
}

interface WidgetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: Widget | null;
  onWidgetUpdate: (widgetId: string, updates: Partial<Widget>) => void;
  onWidgetDelete: (widgetId: string) => void;
}

const WidgetDetailModal: React.FC<WidgetDetailModalProps> = ({
  isOpen,
  onClose,
  widget,
  onWidgetUpdate,
  onWidgetDelete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'settings'>('overview');
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!isOpen || !widget) return null;

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newStatus = !widget.is_active;
      console.log('Toggling widget status from', widget.is_active, 'to', newStatus);
      onWidgetUpdate(widget.id, { is_active: newStatus });
    } catch (error) {
      console.error('Failed to update widget status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Reactivating widget from', widget.is_active, 'to true');
      onWidgetUpdate(widget.id, { is_active: true });
    } catch (error) {
      console.error('Failed to reactivate widget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1000));
      onWidgetDelete(widget.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete widget:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const copyEmbedCode = async () => {
    if (widget.embed_code) {
      try {
        await navigator.clipboard.writeText(widget.embed_code);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        console.error('Failed to copy embed code:', err);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3E54D3] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">{widget.token_id}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                widget.is_active 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  widget.is_active ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                {widget.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-400">{widget.hash}</p>
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

        {/* Navigation Tabs */}
        <div className="px-6 py-4 border-b border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'settings', name: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#3E54D3] text-[#3E54D3]'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Widget Info */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">
                      Created {formatDate(widget.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Embed Code */}
              {widget.embed_code && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Embed Code</h3>
                    <button
                      onClick={copyEmbedCode}
                      className={`text-sm transition-all duration-200 ${
                        copyFeedback 
                          ? 'text-green-400 scale-105' 
                          : 'text-[#3E54D3] hover:text-[#2E44C3]'
                      }`}
                    >
                      {copyFeedback ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-x-auto">
                    {widget.embed_code}
                  </pre>
                  
                  {/* Dark overlay and reactivate button when widget is paused */}
                  {!widget.is_active && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Widget is Paused</h3>
                        <p className="text-gray-400 mb-4">
                          This widget is currently paused and not active on your website.
                        </p>
                        <button
                          onClick={handleReactivate}
                          disabled={isLoading}
                          className="bg-[#3E54D3] hover:bg-[#2E44C3] disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Reactivating...</span>
                            </>
                          ) : (
                            <span>Reactivate Widget</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Analytics Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Performance Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Views Today</span>
                        <span className="text-white">{(widget.views * 0.1).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue Today</span>
                        <span className="text-white">${(widget.revenue * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Conversion Rate</span>
                        <span className="text-white">{widget.conversions}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Widget Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={widget.is_active ? 'text-green-400' : 'text-red-400'}>
                          {widget.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tokens Sold</span>
                        <span className="text-white">{widget.tokens_sold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Links</span>
                        <span className="text-white">{widget.active_links}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Widget Settings</h3>
                <div className="space-y-4">
                                     <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">
                       Widget Status
                     </label>
                     <div className="flex items-center space-x-4">
                       <button
                         onClick={handleToggleStatus}
                         disabled={isLoading}
                         className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                           widget.is_active
                             ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                             : 'bg-[#3E54D3] hover:bg-[#2E44C3] text-white'
                         } disabled:opacity-50`}
                       >
                         {isLoading ? 'Updating...' : widget.is_active ? 'Pause Widget' : 'Activate Widget'}
                       </button>
                       <span className="text-sm text-gray-400">
                         {widget.is_active ? 'Widget is currently active and visible on your website' : 'Widget is paused and hidden from your website'}
                       </span>
                     </div>
                   </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Danger Zone
                    </label>
                    <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-red-200 font-medium">Delete Widget</h4>
                          <p className="text-red-300 text-sm mt-1">
                            This action cannot be undone. This will permanently delete the widget and all its data.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Delete Widget
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Delete Widget</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{widget.token_id}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetDetailModal; 