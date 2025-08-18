# Architecture

## Documentation Index

### [TODO.md](./TODO.md) 🚀

**Phase 1 Development Plan** - Focused on embeddable JavaScript widget and backend:

- **Backend Development**: Database schema, API endpoints, real-time data integration
- **Widget Development**: Lightweight React component with live data display
- **Dashboard Integration**: Admin interface for liquidity pool management
- **Data Pipeline**: Real-time token metrics and analytics

### [DOB_LINK_Technical_Spec.md](./DOB_LINK_Technical_Spec.md)

Technical specifications and requirements:

- System requirements
- API specifications
- Database design
- Security requirements

### [deploy.sh](./deploy.sh)

Deployment scripts and procedures:

- Environment setup
- Deployment automation
- Configuration management
- Rollback procedures

## Quick Navigation

- **Current Development**: [TODO.md](./TODO.md)
- **Technical Details**: [DOB_LINK_Technical_Spec.md](./DOB_LINK_Technical_Spec.md)
- **Deployment**: [deploy.sh](./deploy.sh)

## Phase 1 Focus: Embeddable JavaScript Widget

### **Core Components**

1. **Backend API** (`backend/`)

   - Express.js server with real-time data endpoints
   - PostgreSQL database integration
   - Token metrics aggregation from external APIs
   - Widget configuration and analytics tracking

2. **Embeddable Widget** (`dob-link-widget/`)

   - Lightweight React component (< 50KB gzipped)
   - Real-time data display (price, volume, market cap, APY)
   - Theme and position customization
   - Responsive design for all devices

3. **Admin Dashboard** (`dob-link-dashboard/`)
   - Next.js admin interface
   - Liquidity pool management
   - Widget creation and configuration
   - Analytics and performance monitoring

### **Data Flow**

```
External APIs (CoinGecko, CoinMarketCap)
    ↓
Backend API (Data aggregation & caching)
    ↓
Embeddable Widget (Real-time display)
    ↓
User Websites (Embedded via script tag)
```

### **Key Features**

- **Real-time Token Data**: Live price, volume, market cap updates
- **Lightweight Embedding**: Simple script tag integration
- **Customizable UI**: Themes, positions, and custom styling
- **Analytics Tracking**: View counts, interactions, performance metrics
- **Multi-chain Support**: Ethereum, Polygon, Base, Arbitrum tokens

## Related Documentation

- [API Documentation](../api/)
- [Smart Contracts](../contracts/)
- [Project Management](./TODO.md)
