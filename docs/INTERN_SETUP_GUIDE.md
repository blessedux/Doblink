# Basic Matiii Guide

## 🎯 **Welcome to DOB LINK Development!**

---

## **What You'll Be Working On**

### **Phase 1 Objective**

Build a lightweight, embeddable JavaScript widget that displays real-time liquidity pool data and connects to a robust backend API. The widget will show token information, volume, market cap, price, and distribution amounts from live database data.

### **Your Main Tasks**

1. **Backend API Development** - Express.js server with PostgreSQL
2. **Database Schema Implementation** - Token data and widget configurations
3. **Widget Integration** - Connect the existing widget to real backend data
4. **Real-time Data Pipeline** - Integrate with token price APIs

---

## 🚀 **Quick Setup (15 minutes)**

### **1. Clone the Repository**

```bash
git clone https://github.com/blessedux/Doblink.git
cd DOBLINK
```

### **2. Install Dependencies**

```bash
# Install root dependencies
npm install

# Install widget dependencies
cd dob-link-widget
npm install

# Install dashboard dependencies
cd ../dob-link-dashboard
npm install

# Install backend dependencies
cd ../backend
npm install
```

### **3. Start Development Environment**

```bash
# Terminal 1: Start the widget (for testing)
cd dob-link-widget
npm run dev
# Access at: http://localhost:5173

# Terminal 2: Start the dashboard
cd dob-link-dashboard
npm run dev
# Access at: http://localhost:3000

# Terminal 3: Start the backend (you'll work on this)
cd backend
npm run dev
# Access at: http://localhost:3001
```

---

## 📚 **What to Read First**

### **Essential Documentation**

1. **[TODO.md](./architecture/TODO.md)** - Your complete development roadmap
2. **[Technical Spec](./architecture/DOB_LINK_Technical_Spec.md)** - System requirements
3. **[API Documentation](./api/README.md)** - Endpoints you'll implement

### **Key Files to Understand**

- `dob-link-widget/src/components/DobLinkWidget.tsx` - The widget component
- `dob-link-widget/src/services/api.ts` - API service (currently mock data)
- `backend/src/index.js` - Backend server (you'll build this)
- `docs/architecture/TODO.md` - Your development plan

---

## 🎯 **Your First Tasks (Priority Order)**

### **Task 1: Backend API Setup (Week 1)**

**Goal**: Create the Express.js backend with basic endpoints

#### **What to do:**

1. **Set up PostgreSQL database**

   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name doblink-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=doblink -p 5432:5432 -d postgres:15
   ```

2. **Create database schema** (from TODO.md)

   ```sql
   -- Core liquidity pool information
   CREATE TABLE liquidity_pools (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR NOT NULL,
     description TEXT,
     token_symbol VARCHAR NOT NULL,
     token_address VARCHAR NOT NULL,
     lp_address VARCHAR NOT NULL,
     network VARCHAR NOT NULL,
     wallet_address VARCHAR NOT NULL,
     status VARCHAR DEFAULT 'active',
     total_liquidity DECIMAL,
     apy DECIMAL,
     min_investment DECIMAL,
     max_investment DECIMAL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Implement basic API endpoints**
   - `GET /api/health` - Health check
   - `GET /api/liquidity-pools` - List all pools
   - `GET /api/liquidity-pools/:id` - Get specific pool

### **Task 2: Widget Data Integration (Week 2)**

**Goal**: Replace mock data with real backend calls

#### **What to do:**

1. **Update `dob-link-widget/src/services/api.ts`**

   - Replace mock data with real API calls
   - Implement error handling
   - Add loading states

2. **Test widget with backend**
   - Verify real-time data display
   - Test error scenarios
   - Check performance

### **Task 3: Real-time Data Pipeline (Week 3)**

**Goal**: Integrate with token price APIs

#### **What to do:**

1. **Integrate CoinGecko API**

   - Get real token prices
   - Implement caching
   - Handle rate limits

2. **Create data aggregation service**
   - Combine multiple data sources
   - Implement data validation
   - Set up scheduled updates

---

## 🔧 **Development Environment**

### **Required Tools**

- **Node.js** (v18 or higher)
- **PostgreSQL** (v15 or higher)
- **Git** (for version control)
- **VS Code** (recommended editor)

### **Useful Extensions**

- **PostgreSQL** - Database management
- **REST Client** - API testing
- **GitLens** - Git integration
- **ESLint** - Code quality

### **Environment Variables**

Create `.env` files in each project:

```bash
# backend/.env
DATABASE_URL=postgresql://username:password@localhost:5432/doblink
COINGECKO_API_KEY=your_api_key_here
PORT=3001

# dob-link-widget/.env
VITE_API_BASE_URL=http://localhost:3001/api
```

---

## **Testing Your Work**

### **Backend Testing**

```bash
cd backend
npm test
# Test your API endpoints
```

### **Widget Testing**

```bash
cd dob-link-widget
npm run build
# Check bundle size (< 50KB gzipped)
```

### **Integration Testing**

1. Start all services
2. Open dashboard at `http://localhost:3000`
3. Create a test widget
4. Embed widget on test page
5. Verify real-time data updates

---

## 🆘 **Getting Help**

### **When You're Stuck**

1. **Check the TODO.md** - Your roadmap has detailed steps
2. **Look at existing code** - The widget is already built
3. **Ask questions** - Contact the team at https://t.me/blessedux

### **Common Issues**

- **Database connection**: Check PostgreSQL is running
- **API errors**: Verify endpoints are working with Postman
- **Widget not loading**: Check browser console for errors
- **Build issues**: Clear node_modules and reinstall

---

## 📈 **Success Metrics**

### **Phase 1 Goals**

- ✅ Backend API responding in < 200ms
- ✅ Widget loading in < 1 second
- ✅ Real-time data updates every 30 seconds
- ✅ Bundle size < 50KB gzipped
- ✅ 99.9% uptime

### **Your Progress Tracking**

- [ ] Backend API endpoints implemented
- [ ] Database schema created
- [ ] Widget connected to real data
- [ ] Real-time updates working
- [ ] Error handling implemented
- [ ] Performance optimized

---

## **Next Steps**

1. **Start with Task 1** - Backend API Setup
2. **Read the TODO.md** - Understand the complete plan
3. **Set up your environment** - Follow the setup steps above
4. **Ask questions** - Don't hesitate to reach out

**Vamo con too!**

_For questions or support, contact the DOB Protocol team at https://t.me/blessedux_
