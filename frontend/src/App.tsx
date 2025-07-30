import React, { useState } from 'react';

// Mock data types
interface MockUser {
  id: string;
  email: string;
  name: string;
}

interface MockProject {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  widget_count: number;
  total_views: number;
  total_revenue: number;
}

interface MockWidget {
  id: string;
  hash: string;
  token_id: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  project_id: string;
  embed_code: string;
  active_links: number;
  tokens_sold: number;
  views: number;
  conversions: number;
  revenue: number;
  is_active: boolean;
  created_at: string;
}

interface MockStats {
  totalProjects: number;
  totalWidgets: number;
  activeLinks: number;
  totalViews: number;
  totalTokensSold: number;
  totalRevenue: number;
}

// Mock data
const mockUser: MockUser = {
  id: 'user-1',
  email: 'demo@dobprotocol.com',
  name: 'Demo User'
};

const mockProjects: MockProject[] = [
  {
    id: 'proj-1',
    name: 'Solar Energy Fund',
    description: 'Renewable energy investment tokens for solar projects',
    color: '#10b981',
    created_at: '2024-01-15T10:00:00Z',
    widget_count: 3,
    total_views: 1250,
    total_revenue: 23400
  },
  {
    id: 'proj-2',
    name: 'Wind Power Infrastructure',
    description: 'Wind energy infrastructure and development projects',
    color: '#3b82f6',
    created_at: '2024-01-20T14:30:00Z',
    widget_count: 2,
    total_views: 890,
    total_revenue: 15600
  },
  {
    id: 'proj-3',
    name: 'Hydroelectric Projects',
    description: 'Clean hydroelectric energy generation investments',
    color: '#8b5cf6',
    created_at: '2024-02-01T09:15:00Z',
    widget_count: 1,
    total_views: 450,
    total_revenue: 8900
  }
];

const mockWidgets: MockWidget[] = [
  {
    id: 'widget-1',
    hash: 'dob-solar001-abc123',
    token_id: 'SOLAR001',
    theme: 'dark',
    position: 'bottom-right',
    project_id: 'proj-1',
    embed_code: 'https://dobprotocol.com/widget/dob-solar001-abc123',
    active_links: 15,
    tokens_sold: 234,
    views: 1250,
    conversions: 18.7,
    revenue: 23400,
    is_active: true,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'widget-2',
    hash: 'dob-solar002-def456',
    token_id: 'SOLAR002',
    theme: 'light',
    position: 'top-left',
    project_id: 'proj-1',
    embed_code: 'https://dobprotocol.com/widget/dob-solar002-def456',
    active_links: 8,
    tokens_sold: 156,
    views: 890,
    conversions: 17.5,
    revenue: 15600,
    is_active: true,
    created_at: '2024-01-16T11:00:00Z'
  },
  {
    id: 'widget-3',
    hash: 'dob-wind001-ghi789',
    token_id: 'WIND001',
    theme: 'dark',
    position: 'bottom-right',
    project_id: 'proj-2',
    embed_code: 'https://dobprotocol.com/widget/dob-wind001-ghi789',
    active_links: 12,
    tokens_sold: 189,
    views: 1100,
    conversions: 17.2,
    revenue: 18900,
    is_active: true,
    created_at: '2024-01-20T15:00:00Z'
  }
];

const mockStats: MockStats = {
  totalProjects: 3,
  totalWidgets: 6,
  activeLinks: 35,
  totalViews: 2590,
  totalTokensSold: 579,
  totalRevenue: 47900
};

function App() {
  const [user] = useState<MockUser>(mockUser);
  const [projects, setProjects] = useState<MockProject[]>(mockProjects);
  const [widgets, setWidgets] = useState<MockWidget[]>(mockWidgets);
  const [selectedProject, setSelectedProject] = useState<MockProject>(mockProjects[0]);
  const [selectedWidget, setSelectedWidget] = useState<MockWidget>(mockWidgets[0]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateWidget, setShowCreateWidget] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'widgets' | 'analytics'>('dashboard');
  const [stats] = useState<MockStats>(mockStats);

  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const [newWidget, setNewWidget] = useState({
    tokenId: '',
    theme: 'dark' as const,
    position: 'bottom-right' as const,
    customStyles: {}
  });

  const createProject = () => {
    if (!newProject.name.trim()) return;

    const project: MockProject = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      created_at: new Date().toISOString(),
      widget_count: 0,
      total_views: 0,
      total_revenue: 0
    };

    setProjects([project, ...projects]);
    setSelectedProject(project);
    setShowCreateProject(false);
    setNewProject({ name: '', description: '', color: '#3b82f6' });
  };

  const createWidget = () => {
    if (!selectedProject || !newWidget.tokenId.trim()) return;

    const widget: MockWidget = {
      id: `widget-${Date.now()}`,
      hash: `dob-${newWidget.tokenId.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`,
      token_id: newWidget.tokenId,
      theme: newWidget.theme,
      position: newWidget.position,
      project_id: selectedProject.id,
      embed_code: `https://dobprotocol.com/widget/dob-${newWidget.tokenId.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`,
      active_links: 0,
      tokens_sold: 0,
      views: 0,
      conversions: 0,
      revenue: 0,
      is_active: true,
      created_at: new Date().toISOString()
    };

    setWidgets([widget, ...widgets]);
    setSelectedWidget(widget);
    setShowCreateWidget(false);
    setNewWidget({ tokenId: '', theme: 'dark', position: 'bottom-right', customStyles: {} });
  };

  const generateEmbedCode = (widget: MockWidget, format: 'react' | 'js' | 'html') => {
    switch (format) {
      case 'react':
        return `import { DobLinkWidget } from 'dob-protocol-widget';

<DobLinkWidget
  tokenId="${widget.token_id}"
  theme="${widget.theme}"
  position="${widget.position}"
  hash="${widget.hash}"
/>`;
      case 'js':
        return `<script src="https://dobprotocol.com/link.js"></script>
<script>
  const widget = createDobLinkWidget({
    tokenId: '${widget.token_id}',
    theme: '${widget.theme}',
    position: '${widget.position}',
    hash: '${widget.hash}'
  });
  widget.mount();
</script>`;
      case 'html':
        return `<div id="dob-widget-${widget.hash}"></div>
<script src="https://dobprotocol.com/link.js"></script>
<script>
  createDobLinkWidget({
    tokenId: '${widget.token_id}',
    theme: '${widget.theme}',
    position: '${widget.position}',
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
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">DOB Link</h1>
              <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                DEMO MODE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'projects', name: 'Projects' },
              { id: 'widgets', name: 'Widgets' },
              { id: 'analytics', name: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Widgets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalWidgets}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowCreateProject(true)}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Create New Project</p>
                      <p className="text-sm text-gray-500">Start a new investment project</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowCreateWidget(true)}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Create New Widget</p>
                      <p className="text-sm text-gray-500">Add widget to current project</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{project.widget_count} widgets</span>
                        <span>${project.total_revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <button
                onClick={() => setShowCreateProject(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
                    selectedProject?.id === project.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{project.widget_count}</p>
                      <p className="text-xs text-gray-500">Widgets</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{project.total_views.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">${project.total_revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Widgets Tab */}
        {activeTab === 'widgets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Widgets</h2>
              <button
                onClick={() => setShowCreateWidget(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + New Widget
              </button>
            </div>

            {selectedWidget && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Widget Preview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Preview</h3>
                  <div className="flex justify-center">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{selectedWidget.token_id}</span>
                      </div>
                      <p className="text-sm text-gray-600">Widget Preview</p>
                      <p className="text-xs text-gray-500 mt-1">Theme: {selectedWidget.theme} | Position: {selectedWidget.position}</p>
                    </div>
                  </div>
                </div>

                {/* Widget Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Token ID</label>
                      <p className="text-sm text-gray-900">{selectedWidget.token_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Widget Hash</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-gray-900">{selectedWidget.hash}</p>
                        <button
                          onClick={() => copyToClipboard(selectedWidget.hash)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Views</label>
                        <p className="text-sm text-gray-900">{selectedWidget.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Revenue</label>
                        <p className="text-sm text-gray-900">${selectedWidget.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Embed Code (JavaScript)</label>
                      <div className="mt-1">
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {generateEmbedCode(selectedWidget, 'js')}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(generateEmbedCode(selectedWidget, 'js'))}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Copy Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Widget List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Widgets</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                      selectedWidget?.id === widget.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedWidget(widget)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{widget.token_id}</p>
                        <p className="text-sm text-gray-500">{widget.hash}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{widget.views.toLocaleString()} views</p>
                        <p className="text-sm text-gray-500">${widget.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Conversions</span>
                    <span className="font-medium">{stats.totalTokensSold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="font-medium">{((stats.totalTokensSold / stats.totalViews) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-medium">${stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Top Performing Widgets */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Widgets</h3>
                <div className="space-y-3">
                  {widgets.slice(0, 3).map((widget, index) => (
                    <div key={widget.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">#{index + 1}</span>
                        <span className="text-sm text-gray-600">{widget.token_id}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{widget.views.toLocaleString()} views</p>
                        <p className="text-xs text-gray-500">${widget.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Chart</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart visualization coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="color"
                  value={newProject.color}
                  onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                  className="mt-1 block w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateProject(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Widget Modal */}
      {showCreateWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Widget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Token ID</label>
                <input
                  type="text"
                  value={newWidget.tokenId}
                  onChange={(e) => setNewWidget({ ...newWidget, tokenId: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter token ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  value={newWidget.theme}
                  onChange={(e) => setNewWidget({ ...newWidget, theme: e.target.value as any })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select
                  value={newWidget.position}
                  onChange={(e) => setNewWidget({ ...newWidget, position: e.target.value as any })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateWidget(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={createWidget}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
