# API & Integration

## Documentation Index

### [CDN_DEPLOYMENT_PLAN.md](./CDN_DEPLOYMENT_PLAN.md)

Comprehensive widget CDN deployment strategy:

- CDN infrastructure setup
- Widget bundle optimization
- Distribution pipeline
- Performance monitoring
- Security considerations

### [LP_WIDGET_INTEGRATION_SUMMARY.md](./LP_WIDGET_INTEGRATION_SUMMARY.md)

Liquidity pool and widget integration guide:

- Widget integration patterns
- Data flow architecture
- Real-time updates
- Error handling
- Performance optimization

### [supabase-schema.sql](./supabase-schema.sql)

Database schema and structure:

- Complete database schema
- Table relationships
- Indexes and constraints
- Migration scripts
- Data types and validations

## Quick Navigation

- **Widget Deployment**: [CDN_DEPLOYMENT_PLAN.md](./CDN_DEPLOYMENT_PLAN.md)
- **Integration Guide**: [LP_WIDGET_INTEGRATION_SUMMARY.md](./LP_WIDGET_INTEGRATION_SUMMARY.md)
- **Database Schema**: [supabase-schema.sql](./supabase-schema.sql)

## Related Documentation

- [Architecture Documentation](../architecture/)
- [Smart Contracts](../contracts/)
- [Project Management](../TODO.md)

## API Endpoints

### Widget API

- `GET /api/widgets/:hash/data` - Widget configuration and data
- `GET /api/liquidity-pools/:id/real-time` - Real-time LP data
- `POST /api/analytics/widget-event` - Analytics tracking

### Authentication

- WebAuthn integration for secure wallet creation
- Stellar keypair generation
- Multi-chain wallet support

### Data Flow

1. Widget loads from CDN
2. Fetches configuration from API
3. Real-time data updates
4. User interaction tracking
5. Transaction processing
