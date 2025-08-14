# DOB Link - Embeddable Widget Platform

DOB Link is a comprehensive platform for creating, managing, and tracking embeddable investment widgets. The platform allows users to create customizable widgets that can be embedded on any website to facilitate token investments.

## Architecture

The application consists of three main components:

1. **Admin Panel** - React-based interface for widget management and analytics
2. **Embeddable Widget** - Lightweight React component for embedding on external sites
3. **Smart Contracts** - Soroban-based contracts for handling investments on Stellar

## How It Works

### Widget Management System

The admin panel provides a complete widget management interface with the following features:

- **Project Organization**: Group widgets by projects (e.g., Solar Energy, Wind Power)
- **Unique Hash Generation**: Each widget gets a unique tracking hash (e.g., `dob-solar001-abc123`)
- **Widget Customization**: Configure theme, position, colors, and token information
- **Embed Code Generation**: Generate JavaScript, React, or HTML embed snippets

### Widget Creation Process

1. Create a new project with name, description, and color
2. Add widgets to the project with token ID and configuration
3. System generates unique hash for tracking
4. Generate embed code in preferred format
5. Copy and paste embed code to external websites

### Analytics and Tracking

The platform tracks comprehensive analytics for each widget:

- **Views**: Number of times widget was loaded
- **Conversions**: Percentage of views that resulted in investments
- **Revenue**: Total amount invested through the widget
- **Active Links**: Number of websites currently using the widget

### Embeddable Widget Features

The embeddable widget provides:

- **Floating Button**: Always visible button that expands to show investment interface
- **Dynamic Data**: Real-time APR and TVL updates with fade animations
- **Investment Interface**: Clean form for entering investment amounts
- **Responsive Design**: Works on desktop and mobile devices
- **Customizable Styling**: Theme and color customization options

### Smart Contract Integration

The Soroban smart contracts handle:

- **Investment Storage**: Secure storage of investment data on Stellar blockchain
- **Token Information**: Dynamic token data updates
- **Event Logging**: Off-chain event emission for analytics
- **Admin Management**: Contract administration and configuration

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Widget Distribution**: CDN-ready JavaScript bundles
- **Blockchain**: Soroban (Stellar L1), Rust smart contracts
- **Analytics**: Real-time tracking and performance metrics

## Documentation

Complete documentation is available in the [docs/](./docs/) directory:

- **[Project Management](./docs/TODO.md)** - Tasks, milestones, and implementation phases
- **[Architecture](./docs/architecture/)** - System design, technical specs, and deployment guides
- **[API & Integration](./docs/api/)** - Widget deployment, database schema, and integration guides
- **[Smart Contracts](./docs/contracts/)** - Contract documentation and specifications

## Development

### Running the Admin Panel

```bash
cd frontend
npm install
npm run dev
```

### Building the Widget

```bash
npm run build:widget
```

### Testing the Widget

Open `test-widget.html` in a browser to test the embeddable widget locally.

## Usage

1. Open the admin panel at `http://localhost:5173`
2. Create a new project or select existing project
3. Create widgets with desired configuration
4. Copy the generated embed code
5. Paste the code on any website to embed the widget
6. Monitor performance through the analytics dashboard

The platform provides a complete solution for creating and managing embeddable investment widgets with comprehensive tracking and analytics capabilities.

## Documentation Structure

### [Project Management](./TODO.md)

- **TODO.md** - Project tasks, milestones, and implementation phases

### [Architecture](./architecture/)

- **END_TO_END_PLAN.md** - Complete implementation plan from fiat to token delivery
- **README_NEW_ARCHITECTURE.md** - New architecture overview and migration guide
- **DOB_LINK_Technical_Spec.md** - Technical specifications and requirements
- **DRAPER_U_SPRINT.md** - Sprint planning and development milestones
- **deploy.sh** - Deployment scripts and procedures

### [API & Integration](./api/)

- **CDN_DEPLOYMENT_PLAN.md** - Widget CDN deployment strategy
- **LP_WIDGET_INTEGRATION_SUMMARY.md** - Liquidity pool and widget integration
- **supabase-schema.sql** - Database schema and structure

### [Smart Contracts](./contracts/)

- Smart contract documentation and specifications

## Quick Start

1. **New to the project?** Start with [TODO.md](./TODO.md) for an overview of current tasks
2. **Understanding the architecture?** Read [END_TO_END_PLAN.md](./architecture/END_TO_END_PLAN.md)
3. **Working on API integration?** Check [CDN_DEPLOYMENT_PLAN.md](./api/CDN_DEPLOYMENT_PLAN.md)
4. **Deploying?** Review [deploy.sh](./architecture/deploy.sh)

## 🔗 Related Resources

- [Main Project README](../README.md)
- [Frontend Documentation](../frontend/README.md)
- [Backend Documentation](../backend/README.md)
- [Widget Documentation](../dob-link-widget/README.md)
