import React, { useState } from 'react';
import GuidedWidgetCreation from './components/GuidedWidgetCreation';
import LiquidityPoolManager from './components/LiquidityPoolManager';
import Dashboard from './components/Dashboard';

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
    embed_code: '<script src="https://dobprotocol.com/link.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: "SOLAR001",\n    backgroundColor: "#FFFFFF",\n    preferredCurrency: "USD",\n    hash: "dob-solar001-abc123"\n  }).mount();\n</script>',
    active_links: 15,
    tokens_sold: 234,
    views: 1250,
    conversions: 18.7,
    revenue: 23400,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'widget-2',
    hash: 'dob-wind001-def456',
    token_id: 'WIND001',
    theme: 'light',
    position: 'top-left',
    project_id: 'proj-2',
    embed_code: '<script src="https://dobprotocol.com/link.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: "WIND001",\n    backgroundColor: "#F8F9FA",\n    preferredCurrency: "USD",\n    hash: "dob-wind001-def456"\n  }).mount();\n</script>',
    active_links: 8,
    tokens_sold: 156,
    views: 890,
    conversions: 17.5,
    revenue: 15600,
    is_active: false,
    created_at: '2024-01-18T14:30:00Z'
  }
];

const mockStats: MockStats = {
  totalProjects: 3,
  totalWidgets: 2,
  activeLinks: 23,
  totalViews: 2140,
  totalTokensSold: 390,
  totalRevenue: 39000
};

function App() {
  const [user] = useState<MockUser>(mockUser);
  const [projects, setProjects] = useState<MockProject[]>(mockProjects);
  const [widgets, setWidgets] = useState<MockWidget[]>(mockWidgets);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateWidget, setShowCreateWidget] = useState(false);
  const [showGuidedWidgetCreation, setShowGuidedWidgetCreation] = useState(false);
  const [showLiquidityPoolManager, setShowLiquidityPoolManager] = useState(false);
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
    setShowCreateProject(false);
    setNewProject({ name: '', description: '', color: '#3b82f6' });
  };

  const createWidget = () => {
    if (!newWidget.tokenId.trim()) return;

    const widget: MockWidget = {
      id: `widget-${Date.now()}`,
      hash: `dob-${newWidget.tokenId.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`,
      token_id: newWidget.tokenId,
      theme: newWidget.theme,
      position: newWidget.position,
      project_id: 'proj-1',
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
    setShowCreateWidget(false);
    setNewWidget({ tokenId: '', theme: 'dark', position: 'bottom-right', customStyles: {} });
  };

  const handleGuidedWidgetCreated = (widget: any) => {
    // Convert the guided widget format to our mock format
    const mockWidget: MockWidget = {
      id: `widget-${Date.now()}`,
      hash: widget.hash,
      token_id: widget.tokenId,
      theme: widget.theme,
      position: widget.position,
      project_id: widget.projectId,
      embed_code: widget.embedCode,
      active_links: widget.activeLinks,
      tokens_sold: widget.tokensSold,
      views: widget.views,
      conversions: widget.conversions,
      revenue: widget.revenue,
      is_active: widget.isActive,
      created_at: widget.createdAt
    };

    setWidgets([mockWidget, ...widgets]);
    setShowGuidedWidgetCreation(false);
  };

  const handleWidgetUpdate = (widgetId: string, updates: Partial<MockWidget>) => {
    console.log('Updating widget', widgetId, 'with updates:', updates);
    setWidgets(prevWidgets => {
      const updatedWidgets = prevWidgets.map(widget => 
        widget.id === widgetId ? { ...widget, ...updates } : widget
      );
      console.log('Updated widgets:', updatedWidgets);
      return updatedWidgets;
    });
  };

  const handleWidgetDelete = (widgetId: string) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== widgetId));
  };

  return (
    <>
      <Dashboard
        onShowGuidedWidgetCreation={() => setShowGuidedWidgetCreation(true)}
        onShowLiquidityPoolManager={() => setShowLiquidityPoolManager(true)}
        widgets={widgets}
        projects={projects}
        stats={stats}
        onWidgetUpdate={handleWidgetUpdate}
        onWidgetDelete={handleWidgetDelete}
      />

      {/* Guided Widget Creation Modal */}
      <GuidedWidgetCreation
        isOpen={showGuidedWidgetCreation}
        onClose={() => setShowGuidedWidgetCreation(false)}
        onWidgetCreated={handleGuidedWidgetCreated}
      />

      {/* Liquidity Pool Manager Modal */}
      <LiquidityPoolManager
        isOpen={showLiquidityPoolManager}
        onClose={() => setShowLiquidityPoolManager(false)}
      />
    </>
  );
}

export default App;
