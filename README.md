# DOB Link - Embeddable RWA Token Widget Platform

DOB LINK is a comprehensive platform for creating, managing, and tracking embeddable widgets for RWA (Real World Asset) token marketplaces. The platform allows any website to display real-time token data, prices, and investment opportunities through a lightweight, customizable widget.

## **Project Overview**

### **What is DOB LINK?**

An **embeddable JavaScript widget** that displays real-time cryptocurrency data for RWA tokens (solar farms, wind energy, real estate, etc.). Any website can embed it to show live token prices, market cap, volume, and APY.

### **How It Works**

1. **RWA Projects** create widgets through the admin dashboard
2. **Website Owners** embed the widget with a simple script tag
3. **Visitors** see live token data without leaving the website
4. **Analytics** track performance and user engagement

## 🏗️ **Architecture**

The application consists of four main components:

1. **Admin Dashboard** - Next.js interface for widget management and analytics
2. **Embeddable Widget** - Lightweight React component (< 50KB gzipped)
3. **Backend API** - Express.js server with real-time data endpoints
4. **Database** - PostgreSQL for data persistence

## **Key Features**

### **Widget Management System**

- **Project Organization**: Group widgets by RWA projects (Solar Energy, Wind Power, etc.)
- **Unique Hash Generation**: Each widget gets a unique tracking hash
- **Widget Customization**: Configure theme, position, colors, and token information
- **Embed Code Generation**: Generate secure, backend-generated JavaScript

### **Real-time Data Display**

- **Live Token Prices**: Real-time updates from CoinGecko/CoinMarketCap APIs
- **Market Metrics**: Volume, market cap, APY, total liquidity
- **Dynamic Updates**: Automatic refresh with fade animations
- **Multi-chain Support**: Ethereum, Polygon, Base, Arbitrum tokens

### **Analytics and Tracking**

- **Widget Views**: Number of times widget was loaded
- **User Interactions**: Clicks, wallet connections, engagement metrics
- **Performance Monitoring**: Load times, error rates, uptime
- **Domain Analytics**: Track usage across different websites

## **Technical Stack**

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js, PostgreSQL
- **Widget Distribution**: Backend-generated JavaScript with API key authentication
- **Data Sources**: CoinGecko API, CoinMarketCap API
- **Deployment**: Vercel, Netlify, Cloudflare

## **Documentation**

Complete documentation is available in the [docs/](./docs/) directory:

- **[Development Plan](./docs/architecture/TODO.md)** - Phase 1 implementation roadmap
- **[Architecture Overview](./docs/architecture/README.md)** - System design and components
- **[API Documentation](./docs/api/README.md)** - Endpoints and integration guide
- **[Technical Specifications](./docs/architecture/DOB_LINK_Technical_Spec.md)** - Requirements and deliverables

## **Development**

### **Quick Start**

```bash
# Clone the repository
git clone <repository-url>
cd DOBLINK

# Start the admin dashboard
cd dob-link-dashboard
npm install
npm run dev
# Access at: http://localhost:3000

# Start the widget development
cd dob-link-widget
npm install
npm run dev
# Access at: http://localhost:5173

# Start the backend API
cd backend
npm install
npm run dev
# Access at: http://localhost:3001
```

### **Building for Production**

```bash
# Build the widget
cd dob-link-widget
npm run build
# Output: dist/dob-link-widget.es.js (optimized bundle)

# Build the dashboard
cd dob-link-dashboard
npm run build
npm run start
```

## **Usage**

### **Creating a Widget**

1. Open the admin dashboard at `http://localhost:3000`
2. Create a new project (e.g., "Solar Energy Fund")
3. Add a widget with token configuration
4. Copy the generated embed code
5. Paste the code on any website to embed the widget

### **Embedding Example**

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

## 🔗 **Related Resources**

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Widget Documentation](./dob-link-widget/README.md)
- [API Documentation](./docs/api/README.md)

---

**For questions or support, contact the DOB Protocol team at https://t.me/blessedux**
