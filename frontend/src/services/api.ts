const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface WidgetConfig {
  tokenId: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customStyles: Record<string, string>;
  projectId: string;
}

export interface Widget {
  hash: string;
  tokenId: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customStyles: Record<string, string>;
  projectId: string;
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

export interface AnalyticsEvent {
  widgetHash: string;
  eventType: 'embed' | 'view' | 'sale' | 'wallet_connect';
  domain: string;
  userAgent?: string;
  amount?: number;
  currency?: string;
}

export interface DashboardStats {
  activeLinks: number;
  tokensSold: number;
  views: number;
  revenue: number;
  widgets: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Widget Management
  async createWidget(config: WidgetConfig): Promise<{ success: boolean; widget: Widget }> {
    return this.request('/api/widgets', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getWidget(hash: string): Promise<{ success: boolean; widget: Widget }> {
    return this.request(`/api/widgets/${hash}`);
  }

  async updateWidget(hash: string, config: Partial<WidgetConfig>): Promise<{ success: boolean; widget: Widget }> {
    return this.request(`/api/widgets/${hash}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async deleteWidget(hash: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/widgets/${hash}`, {
      method: 'DELETE',
    });
  }

  async getWidgets(projectId?: string): Promise<{ success: boolean; widgets: Widget[] }> {
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request(`/api/widgets${params}`);
  }

  // Analytics
  async trackEvent(event: AnalyticsEvent): Promise<{ success: boolean; event: any }> {
    return this.request('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async getWidgetAnalytics(
    widgetHash: string, 
    options?: { 
      eventType?: string; 
      startDate?: string; 
      endDate?: string; 
    }
  ): Promise<{ success: boolean; analytics: any[] }> {
    const params = new URLSearchParams();
    if (options?.eventType) params.append('eventType', options.eventType);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);

    const queryString = params.toString();
    const url = `/api/analytics/${widgetHash}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url);
  }

  async getDashboardStats(projectId?: string): Promise<{ success: boolean; stats: DashboardStats }> {
    const params = projectId ? `?projectId=${projectId}` : '';
    return this.request(`/api/analytics/dashboard${params}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  // Analytics tracking helpers
  async trackWidgetView(widgetHash: string, domain: string): Promise<void> {
    try {
      await this.trackEvent({
        widgetHash,
        eventType: 'view',
        domain,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track widget view:', error);
    }
  }

  async trackWidgetEmbed(widgetHash: string, domain: string): Promise<void> {
    try {
      await this.trackEvent({
        widgetHash,
        eventType: 'embed',
        domain,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track widget embed:', error);
    }
  }

  async trackWalletConnect(widgetHash: string, domain: string): Promise<void> {
    try {
      await this.trackEvent({
        widgetHash,
        eventType: 'wallet_connect',
        domain,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track wallet connect:', error);
    }
  }

  async trackSale(widgetHash: string, domain: string, amount: number, currency: string = 'USDC'): Promise<void> {
    try {
      await this.trackEvent({
        widgetHash,
        eventType: 'sale',
        domain,
        userAgent: navigator.userAgent,
        amount,
        currency,
      });
    } catch (error) {
      console.error('Failed to track sale:', error);
    }
  }
}

export const apiService = new ApiService();
export default apiService; 