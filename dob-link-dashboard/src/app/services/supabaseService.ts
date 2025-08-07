import { supabase, Project, Widget, AnalyticsEvent } from '../config/supabase';

// Utility function to generate unique widget hash
const generateWidgetHash = (tokenId: string, projectId: string): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const baseString = `${tokenId}-${projectId}-${timestamp}-${randomSuffix}`;
  
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return `dob-${Math.abs(hash).toString(36)}-${randomSuffix}`;
};

// Utility function to generate embed URL
const generateEmbedUrl = (hash: string): string => {
  return `https://dobprotocol.com/widget/${hash}`;
};

class SupabaseService {
  // Project Management
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Project | null; error: any }> {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    return { data, error };
  }

  async getProjects(userId: string): Promise<{ data: Project[] | null; error: any }> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<{ data: Project | null; error: any }> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  async deleteProject(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // Widget Management
  async createWidget(widgetData: Omit<Widget, 'id' | 'hash' | 'embed_code' | 'created_at' | 'updated_at'>): Promise<{ data: Widget | null; error: any }> {
    const hash = generateWidgetHash(widgetData.token_id, widgetData.project_id);
    const embedCode = generateEmbedUrl(hash);
    
    const { data, error } = await supabase
      .from('widgets')
      .insert([{
        ...widgetData,
        hash,
        embed_code: embedCode,
        active_links: 0,
        tokens_sold: 0,
        views: 0,
        conversions: 0,
        revenue: 0,
        is_active: true
      }])
      .select()
      .single();
    
    return { data, error };
  }

  async getWidgets(projectId?: string): Promise<{ data: Widget[] | null; error: any }> {
    let query = supabase.from('widgets').select('*');
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  }

  async getWidget(hash: string): Promise<{ data: Widget | null; error: any }> {
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('hash', hash)
      .single();
    
    return { data, error };
  }

  async updateWidget(id: string, updates: Partial<Widget>): Promise<{ data: Widget | null; error: any }> {
    const { data, error } = await supabase
      .from('widgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  async deleteWidget(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // Analytics Management
  async trackEvent(eventData: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<{ data: AnalyticsEvent | null; error: any }> {
    const { data, error } = await supabase
      .from('analytics_events')
      .insert([eventData])
      .select()
      .single();
    
    return { data, error };
  }

  async getWidgetAnalytics(
    widgetHash: string, 
    options?: { 
      eventType?: string; 
      startDate?: string; 
      endDate?: string; 
    }
  ): Promise<{ data: AnalyticsEvent[] | null; error: any }> {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('widget_hash', widgetHash);
    
    if (options?.eventType) {
      query = query.eq('event_type', options.eventType);
    }
    
    if (options?.startDate) {
      query = query.gte('created_at', options.startDate);
    }
    
    if (options?.endDate) {
      query = query.lte('created_at', options.endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  }

  async getDashboardStats(userId: string): Promise<{ data: any; error: any }> {
    // Get all projects for user
    const { data: projects, error: projectsError } = await this.getProjects(userId);
    if (projectsError) return { data: null, error: projectsError };

    // Get all widgets for user's projects
    const projectIds = projects?.map(p => p.id) || [];
    const { data: widgets, error: widgetsError } = await supabase
      .from('widgets')
      .select('*')
      .in('project_id', projectIds);
    
    if (widgetsError) return { data: null, error: widgetsError };

    // Calculate stats
    const stats = {
      totalProjects: projects?.length || 0,
      totalWidgets: widgets?.length || 0,
      activeLinks: widgets?.reduce((sum, w) => sum + (w.active_links || 0), 0) || 0,
      totalViews: widgets?.reduce((sum, w) => sum + (w.views || 0), 0) || 0,
      totalTokensSold: widgets?.reduce((sum, w) => sum + (w.tokens_sold || 0), 0) || 0,
      totalRevenue: widgets?.reduce((sum, w) => sum + (w.revenue || 0), 0) || 0,
    };

    return { data: stats, error: null };
  }

  // Analytics tracking helpers
  async trackWidgetView(widgetHash: string, domain: string): Promise<void> {
    try {
      await this.trackEvent({
        widget_hash: widgetHash,
        event_type: 'view',
        domain,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track widget view:', error);
    }
  }

  async trackWidgetEmbed(widgetHash: string, domain: string): Promise<void> {
    try {
      await this.trackEvent({
        widget_hash: widgetHash,
        event_type: 'embed',
        domain,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track widget embed:', error);
    }
  }

  async trackWalletConnect(widgetHash: string, domain: string): Promise<void> {
    try {
      await this.trackEvent({
        widget_hash: widgetHash,
        event_type: 'wallet_connect',
        domain,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track wallet connect:', error);
    }
  }

  async trackSale(widgetHash: string, domain: string, amount: number, currency: string = 'USDC'): Promise<void> {
    try {
      await this.trackEvent({
        widget_hash: widgetHash,
        event_type: 'sale',
        domain,
        user_agent: navigator.userAgent,
        amount,
        currency,
      });
    } catch (error) {
      console.error('Failed to track sale:', error);
    }
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService; 