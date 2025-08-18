# DOB LINK Widget

Lightweight, embeddable React widget for displaying real-time RWA token data. Built with Vite and TypeScript for optimal performance and bundle size.

## Features

- **Real-time Data**: Live token prices, volume, market cap, and APY
- **Lightweight**: < 50KB gzipped bundle size
- **Customizable**: Themes, positioning, and custom styling
- **Responsive**: Works on all devices and screen sizes
- **Secure**: Backend-generated scripts with domain validation

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd dob-link-widget
npm install
```

### Development Server

```bash
npm run dev
```

The widget will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Creates optimized bundle in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Widget Configuration

### Basic Usage

```html
<script src="https://api.dobprotocol.com/widget.js"></script>
<script>
  createDobLinkWidget({
    hash: "dob-solar001-abc123",
    theme: "dark",
    position: "bottom-right",
  }).mount();
</script>
```

### Configuration Options

- `hash` (required): Unique widget identifier
- `theme`: "light" | "dark" (default: "dark")
- `position`: "bottom-right" | "bottom-left" | "top-right" | "top-left" (default: "bottom-right")
- `customStyles`: Object with custom CSS properties

## Project Structure

```
src/
├── components/
│   ├── DobLinkWidget.tsx    # Main widget component
│   └── ui/                  # Reusable UI components
├── contexts/
│   └── PrivyProvider.tsx    # Wallet connection context
├── hooks/
│   └── useWallet.ts         # Wallet integration hook
├── services/
│   └── api.ts              # API service for data fetching
├── App.tsx                 # Main application
├── main.tsx                # Entry point
└── widget.tsx              # Widget entry point
```

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Authentication**: Privy for wallet connections
- **State Management**: React hooks and context

## Integration with Backend

The widget connects to the DOB LINK backend API for:

- Real-time token data (prices, volume, market cap)
- Widget configuration and settings
- Analytics tracking and performance monitoring
- Security validation and domain restrictions

## Performance Optimization

- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination
- **Minification**: Production build optimization
- **Caching**: Efficient data caching strategies

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

The widget is deployed as a backend-generated script for security and performance:

1. Build the widget bundle
2. Backend serves the script with embedded configuration
3. Domain validation ensures secure embedding
4. Real-time data served from backend APIs

## Related Documentation

- [API Documentation](../docs/api/README.md)
- [Architecture Overview](../docs/architecture/README.md)
- [Development Plan](../docs/architecture/TODO.md)
- [Backend Setup](../backend/README.md)

---

**For questions or support, contact the DOB Protocol team at https://t.me/blessedux**
