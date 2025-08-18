# DOB LINK: Technical Specification Document

**Program:** Draper University Sprint  
**Product:** DOB LINK — Embeddable Web3 Widget for Tokenized DePIN Investments  
**Protocol:** DOB Protocol (DePIN Operating Bridge)  
**Certification Layer:** TRUFA  
**Goal:** Enable frictionless display of real-time token data for DePIN RWA tokens via a lightweight, embeddable widget powered by a robust backend API.

---

## Summary

DOB LINK allows anyone to embed a simple one-liner script into their site, enabling real-time display of tokenized infrastructure (DePIN) data including price, volume, market cap, APY, and liquidity information through a lightweight JavaScript widget connected to a powerful backend API.

---

## Core Objectives

1. Build and deploy a marketing + docs landing page at `dobprotocol.com/doblink`.
2. Build a Vite-powered JS widget that displays real-time token data.
3. Create a robust backend API that aggregates and serves token metrics.
4. Develop an admin dashboard for liquidity pool and widget management.

---

## Architecture Flow

```
External APIs → Backend API → Database → Widget → User Websites
(CoinGecko,   (Data Aggregation, (Token Data, (Real-time  (Embedded
 CoinMarketCap) Caching, Analytics) Widget Configs) Display) Script)
```

---

## Deliverables

### 1. Landing Page

**Stack:** Next.js + React + Tailwind  
**URL:** https://dobprotocol.com/doblink  

**Content:**
- What is DOB LINK?
- Benefits for Infra Operators
- Demo of embedded widget
- Documentation (how to embed, how it works)
- Project onboarding form (for tokenized RWAs)

---

### 2. DOB LINK Widget

**Stack:** Vite + React (compiled to lightweight JS bundle)  
**Output:** Embed script or NPM package  
**API Endpoint:** `https://api.dobprotocol.com/widget.js`  

**Behavior:**
- Renders an inline or floating modal UI
- Displays real-time project metadata and token info
- Shows live price, volume, market cap, and APY data
- Updates automatically with fresh data
- Customizable themes and positioning

**Embed Example:**

```html
<script src="https://api.dobprotocol.com/widget.js"></script>
<script>
  createDobLinkWidget({
    hash: 'dob-solar001-abc123',
    theme: 'dark',
    position: 'bottom-right'
  }).mount();
</script>
```

Supports `hash`, `theme`, `position`, `customStyles`, etc.

---

### 3. Backend API (Token Data Aggregation)

**Tech:**
- Express.js API server
- PostgreSQL database
- External API integrations (CoinGecko, CoinMarketCap)
- Real-time data caching and aggregation

**Features:**
1. Token metrics aggregation from multiple sources
2. Real-time data validation and normalization
3. Widget configuration management
4. Analytics tracking and reporting
5. Rate limiting and security

---

### 4. Database Schema (Token Data & Widget Management)

**Core Tables:**
- `liquidity_pools` - Token and LP information
- `token_metrics` - Real-time price and volume data
- `widgets` - Widget configurations and settings
- `widget_analytics` - Usage tracking and metrics

**Functions:**
- Stores token metadata and real-time metrics
- Manages widget configurations and themes
- Tracks analytics and performance data
- Provides data for dashboard and API endpoints

---

## Stack Overview

| Layer          | Tech / Stack                          |
|----------------|----------------------------------------|
| UI (Landing)   | Next.js + Tailwind                     |
| Widget         | Vite + React, embedded via API         |
| Backend        | Express.js + PostgreSQL                |
| Database       | PostgreSQL                             |
| Data Sources   | CoinGecko, CoinMarketCap APIs          |
| Hosting        | Vercel                                 |

---

## Development Phases

### ✅ Phase 1: Setup
- [x] Next.js repo created for landing page
- [x] Vite repo created for widget
- [x] Express.js backend setup
- [x] Project metadata format defined

### 🚧 Phase 2: Core Build
- [x] Initial landing page content
- [x] Widget renders in embed context
- [ ] Backend API with token data endpoints
- [ ] Database schema and migrations
- [ ] External API integrations

### 🔜 Phase 3: Integration & QA
- [ ] End-to-end test: widget with live data
- [ ] Finalize documentation
- [ ] API deployment & public script hosting
- [ ] Analytics via database logs

### 🚀 Phase 4: Launch
- [ ] Partner onboarding with 3+ Infra Operators
- [ ] Feedback loop
- [ ] Iterative enhancements (advanced analytics, custom themes)

---

## Optional Features (Nice to Have)

- Admin dashboard to generate embed snippets
- Advanced analytics and reporting
- Custom styling and themes for embed UI
- Developer metrics: view rates, performance, etc.
- Multi-chain token support

---

## Success Metrics

| KPI                         | Target                            |
|-----------------------------|------------------------------------|
| Load time (widget)          | < 1s                               |
| Bundle size (gzipped)       | < 50 KB                           |
| Onboarded Infra Operators   | ≥ 5 in first 30 days               |
| Widget views                | ≥ 1000 in first month              |
| API response time           | < 200ms                           |
| Uptime (widget + backend)   | ≥ 99.9%                           |

---

## Contact

For technical or partnership inquiries:  
Telegram: [https://t.me/blessedux](https://t.me/blessedux)  
Docs & Updates: [https://dobprotocol.com/doblink](https://dobprotocol.com/doblink)

---
