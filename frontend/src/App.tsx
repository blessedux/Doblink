import React, { useState } from 'react';
import DobLinkWidget from './components/DobLinkWidget';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  widgets: WidgetConfig[];
}

interface WidgetConfig {
  id: string;
  hash: string; // Unique tracking hash
  tokenId: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customStyles: Record<string, string>;
  embedCode: string;
  activeLinks: number;
  tokensSold: number;
  views: number;
  conversions: number;
  revenue: number;
  createdAt: Date;
  lastUpdated: Date;
}

// Utility function to generate unique widget hash
const generateWidgetHash = (tokenId: string, projectId: string): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const baseString = `${tokenId}-${projectId}-${timestamp}-${randomSuffix}`;
  
  // Simple hash function (in production, use crypto-js or similar)
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `dob-${Math.abs(hash).toString(36)}-${randomSuffix}`;
};

// Utility function to generate embed URL with hash
const generateEmbedUrl = (hash: string): string => {
  return `https://dobprotocol.com/widget/${hash}`;
};

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [selectedFormat, setSelectedFormat] = useState<'react' | 'js' | 'html'>('js');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'widgets' | 'analytics' | 'settings'>('widgets');
  const [showPanel, setShowPanel] = useState(false);
  const [newWidgetConfig, setNewWidgetConfig] = useState({
    tokenId: '',
    theme: 'dark' as const,
    position: 'bottom-right' as const,
    customColor: '#3b82f6'
  });
  const [newProjectConfig, setNewProjectConfig] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Solar Energy',
      description: 'Renewable energy investment tokens',
      color: '#10b981',
      widgets: [
        {
          id: '1',
          hash: 'dob-solar001-abc123',
          tokenId: 'SOLAR001',
          theme: 'dark',
          position: 'bottom-right',
          customStyles: {},
          embedCode: 'https://dobprotocol.com/widget/dob-solar001-abc123',
          activeLinks: 15,
          tokensSold: 234,
          views: 1250,
          conversions: 18.7,
          revenue: 23400,
          createdAt: new Date('2024-01-15'),
          lastUpdated: new Date('2024-01-20')
        },
        {
          id: '2',
          hash: 'dob-solar002-def456',
          tokenId: 'SOLAR002',
          theme: 'light',
          position: 'top-left',
          customStyles: { backgroundColor: '#10b981' },
          embedCode: 'https://dobprotocol.com/widget/dob-solar002-def456',
          activeLinks: 8,
          tokensSold: 156,
          views: 890,
          conversions: 17.5,
          revenue: 15600,
          createdAt: new Date('2024-01-16'),
          lastUpdated: new Date('2024-01-19')
        }
      ]
    },
    {
      id: '2',
      name: 'Wind Power',
      description: 'Wind energy infrastructure projects',
      color: '#3b82f6',
      widgets: [
        {
          id: '3',
          hash: 'dob-wind001-ghi789',
          tokenId: 'WIND001',
          theme: 'dark',
          position: 'bottom-right',
          customStyles: {},
          embedCode: 'https://dobprotocol.com/widget/dob-wind001-ghi789',
          activeLinks: 12,
          tokensSold: 189,
          views: 1100,
          conversions: 17.2,
          revenue: 18900,
          createdAt: new Date('2024-01-17'),
          lastUpdated: new Date('2024-01-18')
        }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig>(projects[0].widgets[0]);

  const generateEmbedCode = (widget: WidgetConfig, format: string) => {
    switch (format) {
      case 'react':
        return `import { DobLinkWidget } from 'dob-protocol-widget';

<DobLinkWidget
  tokenId="${widget.tokenId}"
  theme="${widget.theme}"
  position="${widget.position}"
  customStyles={${JSON.stringify(widget.customStyles, null, 2)}}
  hash="${widget.hash}"
/>`;
      case 'js':
        return `<script src="https://dobprotocol.com/link.js"></script>
<script>
  const widget = createDobLinkWidget({
    tokenId: '${widget.tokenId}',
    theme: '${widget.theme}',
    position: '${widget.position}',
    customStyles: ${JSON.stringify(widget.customStyles, null, 2)},
    hash: '${widget.hash}'
  });
  widget.mount();
</script>`;
      case 'html':
        return `<div id="dob-widget-${widget.hash}"></div>
<script src="https://dobprotocol.com/link.js"></script>
<script>
  createDobLinkWidget({
    tokenId: '${widget.tokenId}',
    theme: '${widget.theme}',
    position: '${widget.position}',
    customStyles: ${JSON.stringify(widget.customStyles, null, 2)},
    hash: '${widget.hash}'
  }).mount('#dob-widget-${widget.hash}');
</script>`;
      default:
        return '';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const createNewWidget = () => {
    const widgetHash = generateWidgetHash(newWidgetConfig.tokenId, selectedProject.id);
    const embedUrl = generateEmbedUrl(widgetHash);
    const now = new Date();
    
    const newWidget: WidgetConfig = {
      id: Date.now().toString(),
      hash: widgetHash,
      tokenId: newWidgetConfig.tokenId || `TOKEN${selectedProject.widgets.length + 1}`,
      theme: newWidgetConfig.theme,
      position: newWidgetConfig.position,
      customStyles: { backgroundColor: newWidgetConfig.customColor },
      embedCode: embedUrl,
      activeLinks: 0,
      tokensSold: 0,
      views: 0,
      conversions: 0,
      revenue: 0,
      createdAt: now,
      lastUpdated: now
    };
    
    const updatedProject = {
      ...selectedProject,
      widgets: [...selectedProject.widgets, newWidget]
    };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setSelectedWidget(newWidget);
    setShowCreateModal(false);
    setNewWidgetConfig({
      tokenId: '',
      theme: 'dark',
      position: 'bottom-right',
      customColor: '#3b82f6'
    });
  };

  const createNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectConfig.name,
      description: newProjectConfig.description,
      color: newProjectConfig.color,
      widgets: []
    };
    
    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setShowProjectModal(false);
    setNewProjectConfig({
      name: '',
      description: '',
      color: '#3b82f6'
    });
  };

  const totalStats = projects.reduce((acc, project) => {
    const projectStats = project.widgets.reduce((widgetAcc, widget) => ({
      activeLinks: widgetAcc.activeLinks + widget.activeLinks,
      tokensSold: widgetAcc.tokensSold + widget.tokensSold,
      views: widgetAcc.views + widget.views,
      revenue: widgetAcc.revenue + widget.revenue
    }), { activeLinks: 0, tokensSold: 0, views: 0, revenue: 0 });
    
    return {
      activeLinks: acc.activeLinks + projectStats.activeLinks,
      tokensSold: acc.tokensSold + projectStats.tokensSold,
      views: acc.views + projectStats.views,
      revenue: acc.revenue + projectStats.revenue
    };
  }, { activeLinks: 0, tokensSold: 0, views: 0, revenue: 0 });

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        margin: 0,
        padding: 0,
        transition: 'background 0.3s ease'
      }}
    >
      {/* Main Content Area */}
      <div className="flex h-screen">
        {/* Left Side - Widget Preview */}
        <div className="flex-1 flex items-center justify-center p-8">
          <DobLinkWidget 
            config={{
              tokenId: selectedWidget.tokenId,
              theme: selectedWidget.theme,
              position: selectedWidget.position,
              customStyles: selectedWidget.customStyles
            }}
            onClose={() => {}}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 hover:bg-white/95 transition-all duration-200"
        >
          <svg 
            className={`w-6 h-6 text-gray-700 transition-transform duration-200 ${showPanel ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Right Side - Control Panel */}
        <div className={`fixed right-0 top-0 h-full bg-white/95 backdrop-blur-md border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${showPanel ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '384px' }}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800 mb-2">DOB Widget Admin</h1>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedProject.color }}
              ></div>
              <span className="text-sm text-gray-600">{selectedProject.name}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('widgets')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'widgets' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Widgets
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'analytics' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'widgets' && (
              <div className="p-6 space-y-4">
                {/* Project Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={selectedProject.id}
                    onChange={(e) => {
                      const project = projects.find(p => p.id === e.target.value)!;
                      setSelectedProject(project);
                      setSelectedWidget(project.widgets[0] || project.widgets[0]);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Widget Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Widget</label>
                  <select
                    value={selectedWidget.id}
                    onChange={(e) => setSelectedWidget(selectedProject.widgets.find(w => w.id === e.target.value)!)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedProject.widgets.map(widget => (
                      <option key={widget.id} value={widget.id}>
                        {widget.tokenId} ({widget.activeLinks} links)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Widget Hash Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Widget Hash</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedWidget.hash}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedWidget.hash)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy hash"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Widget Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Created: {selectedWidget.createdAt.toLocaleDateString()}</div>
                    <div>Updated: {selectedWidget.lastUpdated.toLocaleDateString()}</div>
                    <div>Views: {selectedWidget.views.toLocaleString()}</div>
                    <div>Conversions: {selectedWidget.conversions}%</div>
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </div>

                {/* Format Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Embed Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="js">JavaScript</option>
                    <option value="react">React</option>
                    <option value="html">HTML</option>
                  </select>
                </div>

                {/* Embed Code */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Embed Code</label>
                    <button
                      onClick={() => copyToClipboard(generateEmbedCode(selectedWidget, selectedFormat))}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-32">
                    <pre className="whitespace-pre-wrap">{generateEmbedCode(selectedWidget, selectedFormat)}</pre>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    + New Widget
                  </button>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    + New Project
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-6 space-y-6">
                {/* Overall Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalStats.activeLinks}</div>
                      <div className="text-sm text-gray-600">Active Links</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalStats.tokensSold}</div>
                      <div className="text-sm text-gray-600">Tokens Sold</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{totalStats.views.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">${totalStats.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Project Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Performance</h3>
                  <div className="space-y-3">
                    {projects.map(project => {
                      const projectStats = project.widgets.reduce((acc, widget) => ({
                        activeLinks: acc.activeLinks + widget.activeLinks,
                        tokensSold: acc.tokensSold + widget.tokensSold,
                        views: acc.views + widget.views,
                        revenue: acc.revenue + widget.revenue
                      }), { activeLinks: 0, tokensSold: 0, views: 0, revenue: 0 });

                      return (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: project.color }}
                            ></div>
                            <h4 className="font-medium text-gray-800">{project.name}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Links:</span>
                              <span className="font-medium ml-1">{projectStats.activeLinks}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Sold:</span>
                              <span className="font-medium ml-1">{projectStats.tokensSold}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Views:</span>
                              <span className="font-medium ml-1">{projectStats.views.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Revenue:</span>
                              <span className="font-medium ml-1">${projectStats.revenue.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Theme</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Position</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Analytics Tracking</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Enable view tracking</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Enable conversion tracking</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Enable revenue tracking</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create New Widget Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New Widget</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Token ID</label>
                <input
                  type="text"
                  value={newWidgetConfig.tokenId}
                  onChange={(e) => setNewWidgetConfig({...newWidgetConfig, tokenId: e.target.value})}
                  placeholder="e.g., SOLAR001"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={newWidgetConfig.theme}
                  onChange={(e) => setNewWidgetConfig({...newWidgetConfig, theme: e.target.value as any})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <select
                  value={newWidgetConfig.position}
                  onChange={(e) => setNewWidgetConfig({...newWidgetConfig, position: e.target.value as any})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Color</label>
                <input
                  type="color"
                  value={newWidgetConfig.customColor}
                  onChange={(e) => setNewWidgetConfig({...newWidgetConfig, customColor: e.target.value})}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewWidget}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Widget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProjectConfig.name}
                  onChange={(e) => setNewProjectConfig({...newProjectConfig, name: e.target.value})}
                  placeholder="e.g., Solar Energy"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProjectConfig.description}
                  onChange={(e) => setNewProjectConfig({...newProjectConfig, description: e.target.value})}
                  placeholder="Brief description of the project"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Color</label>
                <input
                  type="color"
                  value={newProjectConfig.color}
                  onChange={(e) => setNewProjectConfig({...newProjectConfig, color: e.target.value})}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProjectModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
