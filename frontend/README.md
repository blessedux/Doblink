# Frontend

The DOB Link frontend consists of two main applications: a dashboard for widget management and an embeddable widget for external websites.

## Architecture

### Dashboard Application
React-based admin panel for creating, managing, and tracking embeddable investment widgets.

**Key Features:**
- Project organization and widget management
- Real-time analytics and performance tracking
- Widget customization and embed code generation
- Liquidity pool management and monitoring

### Embeddable Widget
Lightweight React component optimized for CDN distribution and embedding on external websites.

**Key Features:**
- Floating button with expandable investment interface
- Real-time APR and TVL updates
- Responsive design for mobile and desktop
- Customizable themes and positioning

## Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx     # Main dashboard interface
│   ├── DobLinkWidget.tsx # Embeddable widget component
│   ├── ui/              # Reusable UI components
│   └── ...
├── contexts/            # React contexts (Privy auth)
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── config/             # Configuration files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── widget.tsx          # Widget entry point for CDN builds
```

## Build Modes

### Development Mode
```bash
npm run dev
```
Runs both dashboard and widget in development mode with hot reloading.

### Dashboard Build
```bash
npm run build
```
Builds the full dashboard application for production deployment.

### Widget Build
```bash
npm run build:widget
```
Creates optimized widget bundle for CDN distribution (16.6KB gzipped).

### Combined Build
```bash
npm run build:all
```
Builds both dashboard and widget simultaneously.

## Widget Integration

### Basic Usage
```html
<script src="https://cdn.dobprotocol.com/widget.js"></script>
<script>
  const widget = createDobLinkWidget({
    tokenId: "EVCHARGER001",
    theme: "dark",
    position: "bottom-right"
  });
  widget.mount();
</script>
```

### Configuration Options
- `tokenId`: Token identifier for investment display
- `theme`: 'light' or 'dark' theme
- `position`: Widget position ('bottom-right', 'bottom-left', 'top-right', 'top-left')
- `customStyles`: Custom CSS styles object

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite with multi-mode configuration
- **Styling**: Tailwind CSS with custom animations
- **Authentication**: Privy for wallet integration
- **Web3**: Viem and Wagmi for blockchain interactions
- **Database**: Supabase for data persistence
- **Deployment**: Netlify with CDN distribution

## Development Workflow

1. **Start Development Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Test Widget Locally**
   ```bash
   npm run build:widget
   npm run preview:widget
   ```
   Open `test-widget.html` in browser

3. **Build for Production**
   ```bash
   npm run build:all
   ```

## Widget Distribution

The widget is optimized for CDN distribution with:
- External React/ReactDOM dependencies
- Minified and compressed bundles
- ES Module and UMD formats
- CSP-friendly implementation
- Mobile-responsive design

## Analytics Integration

The dashboard provides comprehensive analytics:
- Widget views and conversion tracking
- Revenue and investment monitoring
- Performance metrics and optimization
- Real-time data visualization

## Related Documentation

- [Widget Integration Guide](./README-WIDGET.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [API Documentation](../docs/api/)
- [Architecture Documentation](../docs/architecture/)
