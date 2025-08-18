# DOB LINK Documentation

## **Project Overview**

DOB LINK is an **embeddable JavaScript widget for RWA (Real World Asset) token marketplaces**. It allows any website to display real-time token data, prices, and investment opportunities through a lightweight, customizable widget.

## **Quick Start for New Developers**

### **Are you a new intern or developer?**

Start here: **[Basic Matiii Guide](./INTERN_SETUP_GUIDE.md)** - Complete setup instructions and first tasks

## 📁 **Documentation Structure**

### [Development Plan](./architecture/TODO.md)

**Current Phase 1 Focus** - Backend & embeddable JavaScript widget:

- Database schema and API development
- Widget implementation with real-time data
- Dashboard integration for project management
- Security and analytics implementation

### [Architecture](./architecture/)

- **README.md** - Main architecture overview and project structure
- **TODO.md** - Complete development plan and implementation phases
- **DOB_LINK_Technical_Spec.md** - Technical specifications and requirements
- **deploy.sh** - Deployment scripts and procedures

### [API Documentation](./api/)

- **README.md** - API endpoints, authentication, and integration guide

### [Smart Contracts](./contracts/)

- Smart contract documentation and specifications (future phases)

## **Quick Start**

### **For Developers**

1. **Start here**: [Development Plan](./architecture/TODO.md) - Complete implementation roadmap
2. **Architecture**: [Architecture Overview](./architecture/README.md) - System design and components
3. **API Integration**: [API Documentation](./api/README.md) - Endpoints and integration guide

### **For Project Managers**

1. **Current Status**: [TODO.md](./architecture/TODO.md) - Phase 1 progress and milestones
2. **Technical Specs**: [Technical Specifications](./architecture/DOB_LINK_Technical_Spec.md) - Requirements and deliverables

### **For New Team Members**

1. **Setup Guide**: [Basic Matiii Guide](./INTERN_SETUP_GUIDE.md) - Complete onboarding instructions
2. **Development Plan**: [TODO.md](./architecture/TODO.md) - What to work on first

## **Current Architecture**

### **Core Components**

```
dob-link-dashboard/     # Next.js Admin Panel
dob-link-widget/        # Vite Widget (< 50KB gzipped)
dob-link-shared/        # Shared utilities and types
backend/                # Express.js API server
```

### **Data Flow**

```
External APIs → Backend API → Database → Widget → User Websites
(CoinGecko,   (Data Aggregation, (Token Data, (Real-time  (Embedded
 CoinMarketCap) Caching, Analytics) Widget Configs) Display) Script)
```

## **Phase 1 Goals**

- ✅ **Backend API**: Real-time data endpoints and widget management
- ✅ **Database Schema**: Token data, widget configs, analytics
- ✅ **Widget Component**: Lightweight, embeddable interface
- ✅ **Dashboard**: Project management and widget creation
- 🔄 **Security**: Backend-generated scripts with domain validation
- 🔄 **Analytics**: Usage tracking and performance monitoring

## **Key Features**

- **Real-time Token Data**: Live price, volume, market cap, APY updates
- **Lightweight Embedding**: Simple script tag integration
- **Customizable UI**: Themes, positions, and custom styling
- **Analytics Tracking**: View counts, interactions, performance metrics
- **Multi-chain Support**: Ethereum, Polygon, Base, Arbitrum tokens

## 🔗 **Related Resources**

- [Main Project README](../README.md)
- [Frontend Documentation](../frontend/README.md)
- [Backend Documentation](../backend/README.md)
- [Widget Documentation](../dob-link-widget/README.md)

---

**For questions or support, contact the DOB Protocol team at https://t.me/blessedux**
