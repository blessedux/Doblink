# API Documentation

## Overview

DOB LINK API provides endpoints for the embeddable JavaScript widget system, enabling real-time token data display and analytics tracking. Built with Express.js and PostgreSQL.

## Core API Endpoints

### Widget Management

#### Get Widget Data

```http
GET /api/widgets/:hash/data
```

Returns complete widget configuration and real-time token data.

**Response:**

```json
{
  "success": true,
  "widget": {
    "hash": "dob-solar001-abc123",
    "tokenId": "SOLAR",
    "theme": "dark",
    "position": "bottom-right",
    "customStyles": {},
    "isActive": true
  },
  "tokenData": {
    "symbol": "SOLAR",
    "name": "Solar Energy Token",
    "price": 2.45,
    "marketCap": 2400000,
    "volume24h": 125000,
    "apy": 12.5,
    "totalLiquidity": 2400000,
    "minInvestment": 10,
    "maxInvestment": 100000,
    "priceChange24h": 2.3
  }
}
```

#### Get Real-time Token Metrics

```http
GET /api/liquidity-pools/:id/metrics
```

Returns live token metrics for a specific liquidity pool.

**Response:**

```json
{
  "success": true,
  "metrics": {
    "price": 2.45,
    "marketCap": 2400000,
    "volume24h": 125000,
    "apy": 12.5,
    "totalLiquidity": 2400000,
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

### Analytics Tracking

#### Track Widget Event

```http
POST /api/analytics
```

Track widget interactions and usage analytics.

**Request Body:**

```json
{
  "widgetHash": "dob-solar001-abc123",
  "eventType": "view|click|wallet_connect",
  "domain": "example.com",
  "userAgent": "Mozilla/5.0...",
  "amount": 100,
  "currency": "USD"
}
```

### Health Check

#### API Health Status

```http
GET /api/health
```

Returns API health status and uptime information.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

## Authentication & Security

### API Key Authentication

All widget requests require a valid API key for domain validation and security.

**Header:**

```http
Authorization: Bearer YOUR_API_KEY
```

### Domain Validation

Widgets are restricted to authorized domains only. The backend validates:

- Request origin against widget's domain whitelist
- API key validity and expiration
- Rate limiting per domain

## Data Sources

### External APIs

- **CoinGecko API**: Token price and market data
- **CoinMarketCap API**: Additional market metrics
- **Custom Price Feeds**: Project-specific token data

### Real-time Updates

- WebSocket connections for live price updates
- Polling fallback for real-time data
- Caching layer for performance optimization

## Database Schema

### Core Tables

- `liquidity_pools` - Token and LP information
- `token_metrics` - Real-time price and volume data
- `widgets` - Widget configurations and settings
- `widget_analytics` - Usage tracking and metrics

### Database Setup

The backend uses PostgreSQL with the following connection:

```javascript
// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "doblink",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
};
```

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### Common Error Codes

- `WIDGET_NOT_FOUND` - Widget hash doesn't exist
- `DOMAIN_NOT_AUTHORIZED` - Domain not in widget's whitelist
- `API_KEY_INVALID` - Invalid or expired API key
- `RATE_LIMIT_EXCEEDED` - Too many requests from domain

## Rate Limiting

- **Widget Data**: 100 requests per minute per domain
- **Analytics**: 1000 events per minute per widget
- **Health Check**: 60 requests per minute per IP

## Development

### Local Development

```bash
# Start backend server
cd backend
npm install
npm run dev

# API will be available at http://localhost:3001
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=doblink
DB_USER=postgres
DB_PASSWORD=your_password

# External APIs
COINGECKO_API_KEY=your_coingecko_key
COINMARKETCAP_API_KEY=your_coinmarketcap_key

# Security
JWT_SECRET=your_jwt_secret
API_KEY_SECRET=your_api_key_secret
```

### Testing

```bash
# Run API tests
npm test

# Test specific endpoints
npm run test:widgets
npm run test:analytics
```

## Related Documentation

- [Architecture Overview](../architecture/README.md)
- [Development Plan](../architecture/TODO.md)
- [Technical Specifications](../architecture/DOB_LINK_Technical_Spec.md)
