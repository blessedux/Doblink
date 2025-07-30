-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE widget_theme AS ENUM ('light', 'dark');
CREATE TYPE widget_position AS ENUM ('bottom-right', 'bottom-left', 'top-right', 'top-left');
CREATE TYPE event_type AS ENUM ('embed', 'view', 'sale', 'wallet_connect');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
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
CREATE INDEX idx_widgets_project_id ON public.widgets(project_id);
CREATE INDEX idx_widgets_hash ON public.widgets(hash);
CREATE INDEX idx_analytics_widget_hash ON public.analytics_events(widget_hash);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON public.widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Widgets policies
CREATE POLICY "Users can view widgets from own projects" ON public.widgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create widgets in own projects" ON public.widgets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update widgets from own projects" ON public.widgets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete widgets from own projects" ON public.widgets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = widgets.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Analytics policies
CREATE POLICY "Users can view analytics from own widgets" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.widgets 
            JOIN public.projects ON projects.id = widgets.project_id
            WHERE widgets.hash = analytics_events.widget_hash 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create analytics events" ON public.analytics_events
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
INSERT INTO public.users (id, email) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'test@example.com');

INSERT INTO public.projects (id, name, description, color, user_id) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Solar Energy', 'Renewable energy investment tokens', '#10b981', '00000000-0000-0000-0000-000000000001'),
    ('22222222-2222-2222-2222-222222222222', 'Wind Power', 'Wind energy infrastructure projects', '#3b82f6', '00000000-0000-0000-0000-000000000001');

INSERT INTO public.widgets (hash, token_id, theme, position, project_id, embed_code, active_links, tokens_sold, views, conversions, revenue) VALUES 
    ('dob-solar001-abc123', 'SOLAR001', 'dark', 'bottom-right', '11111111-1111-1111-1111-111111111111', 'https://dobprotocol.com/widget/dob-solar001-abc123', 15, 234, 1250, 18.7, 23400),
    ('dob-solar002-def456', 'SOLAR002', 'light', 'top-left', '11111111-1111-1111-1111-111111111111', 'https://dobprotocol.com/widget/dob-solar002-def456', 8, 156, 890, 17.5, 15600),
    ('dob-wind001-ghi789', 'WIND001', 'dark', 'bottom-right', '22222222-2222-2222-2222-222222222222', 'https://dobprotocol.com/widget/dob-wind001-ghi789', 12, 189, 1100, 17.2, 18900); 