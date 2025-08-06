-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE widget_theme AS ENUM ('light', 'dark');
CREATE TYPE widget_position AS ENUM ('bottom-right', 'bottom-left', 'top-right', 'top-left');
CREATE TYPE event_type AS ENUM ('embed', 'view', 'sale', 'wallet_connect');
CREATE TYPE lp_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE lp_type AS ENUM ('base', 'stellar', 'ethereum', 'polygon', 'arbitrum');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create liquidity_pools table
CREATE TABLE public.liquidity_pools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    token_symbol TEXT NOT NULL,
    token_address TEXT NOT NULL,
    lp_address TEXT NOT NULL,
    network TEXT NOT NULL,
    lp_type lp_type NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    wallet_address TEXT NOT NULL,
    status lp_status DEFAULT 'active',
    total_liquidity DECIMAL(20,8) DEFAULT 0,
    apy DECIMAL(5,2) DEFAULT 0,
    min_investment DECIMAL(10,2) DEFAULT 0,
    max_investment DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    lp_id UUID REFERENCES public.liquidity_pools(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create widgets table
CREATE TABLE public.widgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hash TEXT UNIQUE NOT NULL,
    token_id TEXT NOT NULL,
    theme widget_theme DEFAULT 'dark',
    position widget_position DEFAULT 'bottom-right',
    custom_styles JSONB DEFAULT '{}',
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    lp_id UUID REFERENCES public.liquidity_pools(id) ON DELETE SET NULL,
    embed_code TEXT NOT NULL,
    active_links INTEGER DEFAULT 0,
    tokens_sold INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    conversions DECIMAL(5,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    widget_hash TEXT REFERENCES public.widgets(hash) ON DELETE CASCADE NOT NULL,
    event_type event_type NOT NULL,
    domain TEXT NOT NULL,
    user_agent TEXT,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'USDC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_lp_id ON public.projects(lp_id);
CREATE INDEX idx_widgets_project_id ON public.widgets(project_id);
CREATE INDEX idx_widgets_lp_id ON public.widgets(lp_id);
CREATE INDEX idx_widgets_hash ON public.widgets(hash);
CREATE INDEX idx_analytics_widget_hash ON public.analytics_events(widget_hash);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_liquidity_pools_user_id ON public.liquidity_pools(user_id);
CREATE INDEX idx_liquidity_pools_wallet_address ON public.liquidity_pools(wallet_address);
CREATE INDEX idx_liquidity_pools_status ON public.liquidity_pools(status);
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liquidity_pools_updated_at BEFORE UPDATE ON public.liquidity_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON public.widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liquidity_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Liquidity Pools policies
CREATE POLICY "Users can view own liquidity pools" ON public.liquidity_pools
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own liquidity pools" ON public.liquidity_pools
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own liquidity pools" ON public.liquidity_pools
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own liquidity pools" ON public.liquidity_pools
    FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Widgets policies
CREATE POLICY "Users can view own widgets" ON public.widgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own widgets" ON public.widgets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own widgets" ON public.widgets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own widgets" ON public.widgets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.widgets w
            JOIN public.projects p ON w.project_id = p.id
            WHERE w.hash = analytics_events.widget_hash 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert analytics" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update widget stats
CREATE OR REPLACE FUNCTION public.update_widget_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update widget views when view event is created
    IF NEW.event_type = 'view' THEN
        UPDATE public.widgets 
        SET views = views + 1, updated_at = NOW()
        WHERE hash = NEW.widget_hash;
    END IF;
    
    -- Update widget sales when sale event is created
    IF NEW.event_type = 'sale' AND NEW.amount IS NOT NULL THEN
        UPDATE public.widgets 
        SET tokens_sold = tokens_sold + 1, 
            revenue = revenue + NEW.amount,
            updated_at = NOW()
        WHERE hash = NEW.widget_hash;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for analytics events
CREATE TRIGGER on_analytics_event_created
    AFTER INSERT ON public.analytics_events
    FOR EACH ROW EXECUTE FUNCTION public.update_widget_stats();

-- Insert sample data for testing (optional)
INSERT INTO public.users (id, email, wallet_address) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'test@example.com', '0x1234567890abcdef1234567890abcdef12345678');

INSERT INTO public.liquidity_pools (id, name, description, token_symbol, token_address, lp_address, network, lp_type, user_id, wallet_address, total_liquidity, apy, min_investment, max_investment) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Solar Energy LP', 'Renewable energy investment liquidity pool', 'SOLAR', '0x1234567890abcdef1234567890abcdef12345678', '0xabcdef1234567890abcdef1234567890abcdef12', 'ethereum', 'ethereum', '00000000-0000-0000-0000-000000000001', '0x1234567890abcdef1234567890abcdef12345678', 2400000.00, 12.5, 10.00, 100000.00),
    ('22222222-2222-2222-2222-222222222222', 'Wind Power LP', 'Wind energy infrastructure liquidity pool', 'WIND', '0x2345678901bcdef2345678901bcdef2345678901', '0xbcdef1234567890bcdef1234567890bcdef12345', 'polygon', 'polygon', '00000000-0000-0000-0000-000000000001', '0x1234567890abcdef1234567890abcdef12345678', 1560000.00, 15.2, 25.00, 50000.00);

INSERT INTO public.projects (id, name, description, color, user_id, lp_id) VALUES 
    ('33333333-3333-3333-3333-333333333333', 'Solar Energy', 'Renewable energy investment tokens', '#10b981', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
    ('44444444-4444-4444-4444-444444444444', 'Wind Power', 'Wind energy infrastructure projects', '#3b82f6', '00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222'); 