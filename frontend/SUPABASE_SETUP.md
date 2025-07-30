# DOB Link Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

### 2. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# API Configuration
VITE_API_URL=http://localhost:3001
```

### 3. Database Schema

Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the script

### 4. Authentication Setup

1. In Supabase dashboard, go to Authentication > Settings
2. Add your domain to "Site URL" (e.g., `http://localhost:5173`)
3. Configure Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 5. Row Level Security (RLS)

The schema includes RLS policies that:

- Users can only access their own projects and widgets
- Analytics events can be created by anyone (for tracking)
- Users can only view analytics for their own widgets

## 📊 Database Tables

### Users

- Extends Supabase auth.users
- Stores user profile information

### Projects

- User's investment projects
- Contains name, description, color, and user association

### Widgets

- Investment widgets for each project
- Includes configuration, stats, and tracking hash

### Analytics Events

- Tracks widget interactions
- Events: embed, view, sale, wallet_connect

## 🔧 Features

### ✅ Implemented

- User authentication with Google OAuth
- Project creation and management
- Widget creation with unique hashes
- Real-time analytics tracking
- Dashboard with statistics
- Embed code generation
- Copy-to-clipboard functionality

### 🚧 Coming Soon

- Advanced analytics dashboard
- Widget customization options
- Export functionality
- Team collaboration features

## 🎯 Usage

1. **Sign In**: Users authenticate with Google
2. **Create Project**: Start a new investment project
3. **Create Widget**: Add widgets to projects with unique tracking
4. **Get Embed Code**: Copy generated code to embed on websites
5. **Track Analytics**: Monitor views, conversions, and revenue

## 🔒 Security

- Row Level Security (RLS) ensures data isolation
- Users can only access their own data
- Analytics events are tracked securely
- No sensitive data exposed in embed codes

## 📈 Analytics Tracking

The system automatically tracks:

- Widget views
- Wallet connections
- Sales transactions
- Embed events

All events include domain and user agent information for detailed analytics.

## 🚀 Deployment

1. Set up production environment variables
2. Deploy frontend to your hosting platform
3. Update Supabase site URL for production
4. Configure CDN for widget distribution

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**

   - Check Google OAuth configuration
   - Verify site URL in Supabase settings

2. **Database errors**

   - Ensure schema is properly executed
   - Check RLS policies are active

3. **Widget not loading**
   - Verify Supabase URL and key
   - Check browser console for errors

### Support

For issues or questions, check the Supabase documentation or create an issue in the repository.
