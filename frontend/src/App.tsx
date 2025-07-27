import React, { useState } from 'react';
import DobLinkWidget from './components/DobLinkWidget';

interface WidgetConfig {
  id: string;
  tokenId: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customStyles: Record<string, string>;
  embedCode: string;
  activeLinks: number;
  tokensSold: number;
}

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [selectedFormat, setSelectedFormat] = useState<'react' | 'js' | 'html'>('js');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWidgetConfig, setNewWidgetConfig] = useState({
    tokenId: '',
    theme: 'dark' as const,
    position: 'bottom-right' as const,
    customColor: '#3b82f6'
  });
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    {
      id: '1',
      tokenId: 'SOLAR001',
      theme: 'dark',
      position: 'bottom-right',
      customStyles: {},
      embedCode: 'https://dobprotocol.com/widget/solar001',
      activeLinks: 15,
      tokensSold: 234
    },
    {
      id: '2',
      tokenId: 'WIND002',
      theme: 'light',
      position: 'top-left',
      customStyles: { backgroundColor: '#10b981' },
      embedCode: 'https://dobprotocol.com/widget/wind002',
      activeLinks: 8,
      tokensSold: 156
    }
  ]);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig>(widgets[0]);

  const generateEmbedCode = (widget: WidgetConfig, format: string) => {
    switch (format) {
      case 'react':
        return `import { DobLinkWidget } from 'dob-protocol-widget';

<DobLinkWidget
  tokenId="${widget.tokenId}"
  theme="${widget.theme}"
  position="${widget.position}"
  customStyles={${JSON.stringify(widget.customStyles, null, 2)}}
/>`;
      case 'js':
        return `<script src="https://dobprotocol.com/link.js"></script>
<script>
  const widget = createDobLinkWidget({
    tokenId: '${widget.tokenId}',
    theme: '${widget.theme}',
    position: '${widget.position}',
    customStyles: ${JSON.stringify(widget.customStyles, null, 2)}
  });
  widget.mount();
</script>`;
      case 'html':
        return `<div id="dob-widget-${widget.id}"></div>
<script src="https://dobprotocol.com/link.js"></script>
<script>
  createDobLinkWidget({
    tokenId: '${widget.tokenId}',
    theme: '${widget.theme}',
    position: '${widget.position}',
    customStyles: ${JSON.stringify(widget.customStyles, null, 2)}
  }).mount('#dob-widget-${widget.id}');
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
    const newWidget: WidgetConfig = {
      id: Date.now().toString(),
      tokenId: newWidgetConfig.tokenId || `TOKEN${widgets.length + 1}`,
      theme: newWidgetConfig.theme,
      position: newWidgetConfig.position,
      customStyles: { backgroundColor: newWidgetConfig.customColor },
      embedCode: `https://dobprotocol.com/widget/${newWidgetConfig.tokenId.toLowerCase()}`,
      activeLinks: 0,
      tokensSold: 0
    };
    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget);
    setShowCreateModal(false);
    setNewWidgetConfig({
      tokenId: '',
      theme: 'dark',
      position: 'bottom-right',
      customColor: '#3b82f6'
    });
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: backgroundColor,
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Admin Panel */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-800">DOB Widget Admin Panel</h1>
          
          {/* Background Color Control */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Background:</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Embed Format Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Format:</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="px-3 py-1 rounded border border-gray-300 text-sm"
            >
              <option value="js">JavaScript</option>
              <option value="react">React</option>
              <option value="html">HTML</option>
            </select>
          </div>

          {/* Widget Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Widget:</label>
            <select
              value={selectedWidget.id}
              onChange={(e) => setSelectedWidget(widgets.find(w => w.id === e.target.value)!)}
              className="px-3 py-1 rounded border border-gray-300 text-sm"
            >
              {widgets.map(widget => (
                <option key={widget.id} value={widget.id}>
                  {widget.tokenId} ({widget.activeLinks} links, {widget.tokensSold} sold)
                </option>
              ))}
            </select>
          </div>

          {/* Create New Widget */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + New Widget
          </button>
        </div>
      </div>

      {/* Widget Preview - Always Visible */}
      <div className="pt-20 pb-32">
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

      {/* Embed Code Panel - Smaller, Fixed Position */}
      <div className="fixed bottom-4 right-4 w-1/4 z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Embed Code</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{selectedWidget.activeLinks} links</span>
              <span className="text-xs text-gray-500">{selectedWidget.tokensSold} sold</span>
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
          </div>
          <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-32">
            <pre className="whitespace-pre-wrap">{generateEmbedCode(selectedWidget, selectedFormat)}</pre>
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
    </div>
  );
}

export default App;
