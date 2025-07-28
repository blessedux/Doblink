# DOB Link Backend API

Backend API for DOB Link widget management and analytics tracking.

## Features

- **Widget Management**: Create, read, update, delete widgets
- **Analytics Tracking**: Track views, sales, wallet connections, and embeds
- **Dashboard Stats**: Get aggregated analytics data
- **Real-time Updates**: Track widget performance metrics

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

### Widget Management

#### Create Widget

```
POST /api/widgets
Content-Type: application/json

{
  "tokenId": "SOLAR001",
  "theme": "dark",
  "position": "bottom-right",
  "customStyles": {},
  "projectId": "project-123"
}
```

#### Get Widget

```
GET /api/widgets/:hash
```

#### Update Widget

```
PUT /api/widgets/:hash
Content-Type: application/json

{
  "theme": "light",
  "customStyles": { "backgroundColor": "#ffffff" }
}
```

#### Delete Widget

```
DELETE /api/widgets/:hash
```

#### Get All Widgets

```
GET /api/widgets?projectId=project-123
```

### Analytics

#### Track Event

```
POST /api/analytics
Content-Type: application/json

{
  "widgetHash": "dob-solar001-abc123",
  "eventType": "view",
  "domain": "example.com",
  "userAgent": "Mozilla/5.0...",
  "amount": 100,
  "currency": "USDC"
}
```

#### Get Widget Analytics

```
GET /api/analytics/:widgetHash?eventType=view&startDate=2024-01-01&endDate=2024-01-31
```

#### Get Dashboard Stats

```
GET /api/analytics/dashboard?projectId=project-123
```

## Event Types

- `embed`: Widget was embedded on a website
- `view`: Widget was viewed by a user
- `wallet_connect`: User connected their wallet
- `sale`: User completed a transaction

## Data Storage

Currently uses in-memory storage (Map and Array). For production, replace with:

- **Database**: PostgreSQL, MongoDB, or similar
- **Cache**: Redis for performance
- **Queue**: For analytics processing

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

## Security

- CORS enabled for cross-origin requests
- Helmet.js for security headers
- Input validation with Joi
- Rate limiting (to be implemented)

## Testing

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure database connection
3. Set up monitoring and logging
4. Enable rate limiting
5. Configure CORS for production domains

## Integration with Frontend

The frontend uses the `apiService` to communicate with this backend:

```javascript
import apiService from "../services/api";

// Create widget
const widget = await apiService.createWidget({
  tokenId: "SOLAR001",
  theme: "dark",
  position: "bottom-right",
  customStyles: {},
  projectId: "project-123",
});

// Track analytics
await apiService.trackWidgetView("widget-hash", "example.com");
```
