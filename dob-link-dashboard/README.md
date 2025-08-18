# DOB LINK Dashboard

Next.js admin dashboard for managing embeddable RWA token widgets. Provides a comprehensive interface for creating, configuring, and monitoring widgets across different projects.

## Features

- **Project Management**: Organize widgets by RWA projects (Solar Energy, Wind Power, etc.)
- **Widget Creation**: Generate unique widget hashes and configurations
- **Real-time Analytics**: Track widget performance and user interactions
- **Liquidity Pool Management**: Monitor token metrics and investment data
- **Customization Tools**: Configure themes, positions, and styling options

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd dob-link-dashboard
npm install
```

### Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx   # Main dashboard interface
│   │   ├── GuidedWidgetCreation.tsx
│   │   ├── LiquidityPoolManager.tsx
│   │   ├── ProjectDetailModal.tsx
│   │   ├── WidgetDetailModal.tsx
│   │   └── ui/             # Reusable UI components
│   ├── contexts/
│   │   └── PrivyProvider.tsx
│   ├── hooks/
│   │   └── useWallet.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── apiService.ts
│   ├── layout.tsx
│   └── page.tsx
```

## Key Components

### Dashboard Interface

- **Project Overview**: List of all RWA projects and their widgets
- **Widget Management**: Create, edit, and delete widgets
- **Analytics Dashboard**: Real-time performance metrics
- **Configuration Panel**: Customize widget appearance and behavior

### Widget Creation Flow

1. **Project Selection**: Choose or create an RWA project
2. **Token Configuration**: Set up token details and metrics
3. **Widget Customization**: Configure theme, position, and styling
4. **Embed Code Generation**: Generate secure embed scripts
5. **Analytics Setup**: Configure tracking and monitoring

## Technology Stack

- **Framework**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Privy for wallet connections
- **State Management**: React hooks and context
- **Backend Integration**: Express.js API

## API Integration

The dashboard connects to the DOB LINK backend API for:

- Widget creation and management
- Real-time analytics data
- Liquidity pool information
- User authentication and permissions

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Other Platforms

```bash
npm run build
npm start
```

## Analytics Features

- **Widget Views**: Track how many times widgets are loaded
- **User Interactions**: Monitor clicks, wallet connections, and engagement
- **Performance Metrics**: Load times, error rates, and uptime
- **Domain Analytics**: Track usage across different websites

## Security

- **API Key Management**: Secure widget authentication
- **Domain Validation**: Restrict widget usage to authorized domains
- **User Permissions**: Role-based access control
- **Data Encryption**: Secure storage of sensitive information

## Related Documentation

- [API Documentation](../docs/api/README.md)
- [Architecture Overview](../docs/architecture/README.md)
- [Development Plan](../docs/architecture/TODO.md)
- [Backend Setup](../backend/README.md)
- [Widget Documentation](../dob-link-widget/README.md)

---

**For questions or support, contact the DOB Protocol team at https://t.me/blessedux**
