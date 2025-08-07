'use client';

import { useState } from 'react';
import Dashboard from './components/Dashboard';
import GuidedWidgetCreation from './components/GuidedWidgetCreation';
import LiquidityPoolManager from './components/LiquidityPoolManager';

// Mock data types
interface MockWidget {
  id: string;
  hash: string;
  token_id: string;
  theme: string;
  position: string;
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

interface MockStats {
  totalProjects: number;
  totalWidgets: number;
  activeLinks: number;
  totalViews: number;
  totalTokensSold: number;
  totalRevenue: number;
}

// Mock data
const mockProjects: MockProject[] = [
  {
    id: 'proj-1',
    name: 'Solar Energy Fund',
    description: 'Investment in solar energy infrastructure and renewable energy projects.',
    color: '#FF6B6B',
    created_at: '2024-01-15T10:00:00Z',
    widget_count: 2,
    total_views: 1570,
    total_revenue: 30100
  },
  {
    id: 'proj-2',
    name: 'Wind Energy Portfolio',
    description: 'Diversified wind energy investments across multiple locations.',
    color: '#4ECDC4',
    created_at: '2024-01-18T14:30:00Z',
    widget_count: 1,
    total_views: 890,
    total_revenue: 15600
  },
  {
    id: 'proj-3',
    name: 'Hydroelectric Assets',
    description: 'Large-scale hydroelectric power generation investments.',
    color: '#45B7D1',
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
    token_id: 'SOL',
    theme: 'dark',
    position: 'bottom-right',
    project_id: 'proj-1',
    embed_code: '<script src="https://cdn.dobprotocol.com/widget.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: "SOL",\n    backgroundColor: "#FFFFFF",\n    preferredCurrency: "USD",\n    hash: "dob-solar001-abc123"\n  }).mount();\n</script>',
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
    token_id: 'WND',
    theme: 'light',
    position: 'top-left',
    project_id: 'proj-2',
    embed_code: '<script src="https://cdn.dobprotocol.com/widget.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: "WND",\n    backgroundColor: "#F8F9FA",\n    preferredCurrency: "USD",\n    hash: "dob-wind001-def456"\n  }).mount();\n</script>',
    active_links: 8,
    tokens_sold: 156,
    views: 890,
    conversions: 17.5,
    revenue: 15600,
    is_active: false,
    created_at: '2024-01-18T14:30:00Z'
  },
  {
    id: 'widget-3',
    hash: 'dob-hydro001-ghi789',
    token_id: 'HYD',
    theme: 'light',
    position: 'bottom-right',
    project_id: 'proj-3',
    embed_code: '<script src="https://cdn.dobprotocol.com/widget.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: "HYD",\n    backgroundColor: "#E5F3FF",\n    preferredCurrency: "USD",\n    hash: "dob-hydro001-ghi789"\n  }).mount();\n</script>',
    active_links: 12,
    tokens_sold: 89,
    views: 450,
    conversions: 19.8,
    revenue: 8900,
    is_active: true,
    created_at: '2024-02-01T09:15:00Z'
  },
  {
    id: 'widget-4',
    hash: 'dob-geo001-jkl012',
    token_id: 'GEO',
    theme: 'dark',
    position: 'top-right',
    project_id: 'proj-1',
    embed_code: '<script src="https://cdn.dobprotocol.com/widget.js"></script>\n<script>\n  createDobLinkWidget({\n    tokenId: "GEO",\n    backgroundColor: "#F0F9FF",\n    preferredCurrency: "EUR",\n    hash: "dob-geo001-jkl012"\n  }).mount();\n</script>',
    active_links: 6,
    tokens_sold: 67,
    views: 320,
    conversions: 20.9,
    revenue: 6700,
    is_active: true,
    created_at: '2024-01-25T16:45:00Z'
  }
];

const mockStats: MockStats = {
  totalProjects: 3,
  totalWidgets: 4,
  activeLinks: 41,
  totalViews: 2910,
  totalTokensSold: 546,
  totalRevenue: 54600
};

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<MockWidget[]>(mockWidgets);
  const [projects, setProjects] = useState<MockProject[]>(mockProjects);
  const [stats, setStats] = useState<MockStats>(mockStats);
  const [showGuidedWidgetCreation, setShowGuidedWidgetCreation] = useState(false);
  const [showLiquidityPoolManager, setShowLiquidityPoolManager] = useState(false);

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
        onWidgetCreated={(widget) => {
          const newWidget: MockWidget = {
            id: `widget-${Date.now()}`,
            hash: widget.hash,
            token_id: widget.tokenId,
            theme: 'light',
            position: 'bottom-right',
            project_id: 'proj-1',
            embed_code: widget.embedCode,
            active_links: 0,
            tokens_sold: 0,
            views: 0,
            conversions: 0,
            revenue: 0,
            is_active: true,
            created_at: new Date().toISOString()
          };
          setWidgets(prev => [...prev, newWidget]);
          setShowGuidedWidgetCreation(false);
        }}
      />

      {/* Liquidity Pool Manager Modal */}
      <LiquidityPoolManager
        isOpen={showLiquidityPoolManager}
        onClose={() => setShowLiquidityPoolManager(false)}
      />
    </>
  );
}
