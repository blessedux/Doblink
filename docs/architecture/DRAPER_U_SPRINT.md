# DOB Link Technical Development Scope

**Program:** Draper University  
**Product:** DOB Link — a lightweight, embeddable Web3 on-ramp widget for RWA token purchases  
**Protocol:** DOB Protocol (DePIN Operating Bridge)  
**Certifications:** TRUFA Certified Projects
**Goal:** Enable frictionless, fiat-to-token investment via a simple embeddable UI.

---

## Objectives

1. **Build a modern landing page** (marketing + docs + SEO) using Next.js + React + Tailwind.
2. **Develop DOB Link:** a lightweight JS widget that any tokenized RWA project can embed to sell their tokens using fiat (via Stellar).
3. **Write a Soroban smart contract** to register deposits, validate purchases, and prepare funds for injection into Interoperable LPs.

---

## Architecture Overview

```
USD → (Stellar Anchor) → USDC → (Soroban Smart Contract) → Logged + Await Injection → Base LPs
```

- **Frontend** = JS/Vite-based embeddable widget
- **Backend** = Soroban smart contract on Stellar + PostgreSQL

---

## Deliverables

### 1. Landing Page (Next.js + React + Tailwind)

**URL:** `dobprotocol.com/doblink`

**Purpose:**

- Explain what DOB Link is
- Onboard partners (infra operators)
- Display live integration previews
- Documentation for embedding

**Features:**

- Marketing content (SEO-ready)
- Live demo embed
- Docs section for developers
- Call-to-action for project onboarding

---

### 2. DOB Link Widget (Embeddable JS UI)

**Output:** One-liner `<script>` snippet or NPM package  
**Built with:** Vite + React, minimal dependencies

**Loads a lightweight floating modal or inline UI with:**

- Project name + token info (fetched from metadata registry or props)
- USD on-ramp via Stellar Anchor
- Payment flow into Soroban USDC contract

**Target usage:** Any project can add this to their own website to let users buy their token.

#### Embedding Flow:

```html
<script
  src="https://dobprotocol.com/link.js"
  data-token-id="EVCHARGER001"
></script>
```

- Customizable via data attributes
- Supports mounting in a specific DOM element (`<div id="doblink-widget">`)

---

### 3. USD On-Ramp via Stellar Anchors

**Use Stellar Anchor Directory** to support USD → USDC

**Walk user through:**

- KYC via Anchor
- Fiat deposit via bank card or ACH
- Convert to Stellar-native USDC

**Tech:**

- Integrated via JS pop-up flow inside widget
- Post-conversion, widget automatically pushes USDC to smart contract

---

### 4. Soroban Smart Contract (Liquidity Intake)

**Accepts USDC deposits** from widget

**Stores:**

- Buyer wallet
- Token/project ID
- Deposit amount
- Timestamp
- Marks for off-chain relay by DOB Agent
- Event logs allow verification and settlement

## Optional (Nice to Have)

- Developer dashboard to generate script snippets
- Dynamic iframe fallback for non-js environments
- Event analytics via Supabase for partner insights

---

## Stack Overview

| Layer          | Tech Stack                        |
| -------------- | --------------------------------- |
| Landing Page   | Next.js + React + Tailwind        |
| Widget         | JS bundle via Vite + CDN          |
| Backend        | Supabase                          |
| Smart Contract | Soroban                           |
| On-Ramp        | Stellar Anchor API (USD → USDC)   |
| Dev Tools      | GitHub Actions, Vercel Deployment |

---

## Development Phases

new backend?

### Phase 1: Foundation

- [x] Set up Next.js project for landing page
- [x] Set up Vite + React project for embeddable widget
- [x] Create basic landing page layout
- [x] Design widget component architecture
- [x] Set up Soroban development environment

### Phase 2: Core Widget

- [x] Build embeddable widget component
- [ ] Implement Stellar Anchor integration
- [ ] Create Soroban smart contract
- [ ] Add wallet connection functionality

### Phase 3: Integration & Polish

- [ ] Complete landing page with docs
- [ ] Widget customization options
- [ ] Testing and optimization
- [ ] Deployment and CDN setup

### Phase 4: Launch

- [ ] Documentation finalization
- [ ] Partner onboarding materials
- [ ] Analytics and monitoring
- [ ] Public launch

---

## Success Metrics

- **Widget Load Time:** < 2 seconds
- **Bundle Size:** < 100KB gzipped
- **Uptime:** 99.9%
- **Partner Onboarding:** 5+ projects in first month
- **Transaction Volume:** $10K+ in first quarter

---

_For more information, contact the DOB Protocol team at https://t.me/blessedux_
