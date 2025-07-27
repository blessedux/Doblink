import React from 'react';
import { createRoot } from 'react-dom/client';
import DobLinkWidget from './components/DobLinkWidget';

// Widget configuration interface
export interface DobLinkWidgetConfig {
  tokenId?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customStyles?: Record<string, string>;
}

// Main widget class
class DobLinkWidgetClass {
  private config: DobLinkWidgetConfig;
  private container: HTMLDivElement | null = null;
  private root: any = null;

  constructor(config: DobLinkWidgetConfig = {}) {
    this.config = {
      tokenId: 'default',
      theme: 'dark',
      position: 'bottom-right',
      ...config
    };
  }

  mount(target?: string | HTMLElement) {
    // Create container if not provided
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'dob-link-widget-container';
      this.container.style.cssText = `
        position: fixed;
        z-index: 9999;
        ${this.getPositionStyles()}
      `;
    }

    // Mount to target or append to body
    if (typeof target === 'string') {
      const targetElement = document.querySelector(target);
      if (targetElement) {
        targetElement.appendChild(this.container!);
      } else {
        document.body.appendChild(this.container!);
      }
    } else if (target instanceof HTMLElement) {
      target.appendChild(this.container!);
    } else {
      document.body.appendChild(this.container!);
    }

    // Render React component
    this.root = createRoot(this.container!);
    this.root.render(
      <DobLinkWidget 
        config={this.config}
        onClose={() => this.unmount()}
      />
    );
  }

  unmount() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  private getPositionStyles(): string {
    const { position } = this.config;
    switch (position) {
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }
}

// Global function for script tag usage
declare global {
  interface Window {
    DobLinkWidget: typeof DobLinkWidgetClass;
    createDobLinkWidget: (config?: DobLinkWidgetConfig) => DobLinkWidgetClass;
  }
}

// Expose to global scope
if (typeof window !== 'undefined') {
  window.DobLinkWidget = DobLinkWidgetClass;
  window.createDobLinkWidget = (config?: DobLinkWidgetConfig) => {
    return new DobLinkWidgetClass(config);
  };
}

export default DobLinkWidgetClass; 