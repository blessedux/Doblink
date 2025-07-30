import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Widget {
  id: string;
  hash: string;
  token_id: string;
  theme: 'light' | 'dark';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  custom_styles: Record<string, string>;
  project_id: string;
  embed_code: string;
  active_links: number;
  tokens_sold: number;
  views: number;
  conversions: number;
  revenue: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  widget_hash: string;
  event_type: 'embed' | 'view' | 'sale' | 'wallet_connect';
  domain: string;
  user_agent?: string;
  amount?: number;
  currency?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
} 