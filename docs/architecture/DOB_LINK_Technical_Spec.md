# DOB LINK: Technical Specification Document

**Program:** Draper University Sprint  
**Product:** DOB LINK — Embeddable Web3 On-Ramp for Tokenized DePIN Investments  
**Protocol:** DOB Protocol (DePIN Operating Bridge)  
**Certification Layer:** TRUFA  
**Goal:** Enable frictionless, fiat-to-token investment for DePIN RWA tokens via a lightweight, embeddable widget powered by Stellar + Soroban + AlchemyPay.

---

## Summary

DOB LINK allows anyone to embed a simple one-liner script into their site, enabling users to invest in tokenized infrastructure (DePIN) using **fiat (USD)** through **AlchemyPay**, routed to **USDC on Stellar**, and settled into a **Soroban smart contract** that logs the transaction for off-chain processing.

---

## Core Objectives

1. Build and deploy a marketing + docs landing page at `dobprotocol.com/doblink`.
2. Build a Vite-powered JS widget that handles user on-ramp and token purchases.
3. Integrate a fiat → USDC on-ramp via **Stellar Anchor Directory** (AlchemyPay-enabled anchors).
4. Create a **Soroban smart contract** that:
   - Accepts USDC
   - Logs investor deposits
   - Registers token/project ID for follow-up distribution

---

## Architecture Flow

```
User pays USD → AlchemyPay Anchor → USDC on Stellar → Soroban Contract → Logged Deposit → LP Admin Injects into Interoperable Pool (e.g. Base)
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
**CDN Endpoint:** `https://dobprotocol.com/link.js`  

**Behavior:**
- Renders an inline or floating modal UI
- Displays project metadata and token info
- Connects wallet (via Stellar WebAuthn/Passkeys or Freighter)
- Walks user through fiat → USDC onramp via Stellar Anchor (AlchemyPay)
- Pushes resulting USDC to Soroban contract

**Embed Example:**

```html
<script
  src="https://dobprotocol.com/link.js"
  data-token-id="EVCHARGER001"
></script>
```

Supports `data-project-name`, `data-style`, `data-mount-id`, etc.

---

### 3. Fiat On-Ramp via Stellar Anchor Directory (AlchemyPay)

**Tech:**
- Query **Stellar Anchor Directory** to find supported USD anchors
- Filter for **AlchemyPay-enabled** or compliant anchors
- Use the SEP-24 interactive deposit protocol to launch KYC + card-based flow

**Steps:**
1. User enters USD amount
2. Opens AlchemyPay/Anchor-hosted flow via popup or iframe
3. Completes KYC + fiat deposit via Apple Pay / Google Pay / card
4. Anchor issues **USDC to user's Stellar wallet**
5. Widget listens for USDC and sends it to **target Soroban contract**

---

### 4. Soroban Smart Contract (USDC Intake & Logging)

**Functions:**
- Accepts `USDC` deposits
- Stores:
  - `buyer_wallet`
  - `project_id`
  - `deposit_amount`
  - `timestamp`
- Emits `InvestmentLogged` event for DOB Agent to process
- Does **not** immediately mint tokens — that’s handled off-chain or in future upgrade

---

## Stack Overview

| Layer          | Tech / Stack                          |
|----------------|----------------------------------------|
| UI (Landing)   | Next.js + Tailwind                     |
| Widget         | Vite + React, embedded via CDN         |
| Auth           | Stellar WebAuthn / Passkeys / Freighter |
| On-Ramp        | Stellar Anchor (AlchemyPay support)    |
| Smart Contract | Soroban (USDC intake + event emit)     |
| DB             | Supabase (PostgreSQL)                  |
| Hosting        | Vercel                                 |

---

## Development Phases

### ✅ Phase 1: Setup
- [x] Next.js repo created for landing page
- [x] Vite repo created for widget
- [x] Soroban dev environment ready
- [x] Project metadata format defined

### 🚧 Phase 2: Core Build
- [x] Initial landing page content
- [x] Widget renders in embed context
- [ ] Integrate SEP-24 Anchor flow (AlchemyPay)
- [ ] Build Soroban contract for deposit logging
- [ ] Connect wallet flow (WebAuthn or Freighter)

### 🔜 Phase 3: Integration & QA
- [ ] End-to-end test: USD → token investment via test anchor
- [ ] Finalize documentation
- [ ] CDN deployment & public script hosting
- [ ] Analytics via Supabase logs

### 🚀 Phase 4: Launch
- [ ] Partner onboarding with 3+ Infra Operators
- [ ] Feedback loop
- [ ] Iterative enhancements (token minting, off-ramp, dashboards)

---

## Optional Features (Nice to Have)

- Admin dashboard to generate embed snippets
- Optional iframe version of the widget
- Token minting automation (post Soroban log verification)
- Custom styling and themes for embed UI
- Developer metrics: conversion rate, onramp volume, etc.

---

## Success Metrics

| KPI                         | Target                            |
|-----------------------------|------------------------------------|
| Load time (widget)          | < 2s                               |
| Bundle size (gzipped)       | < 100 KB                           |
| Onboarded Infra Operators   | ≥ 5 in first 30 days               |
| User conversion (USD → USDC)| ≥ 20% of starts complete onramp    |
| Transaction volume (Q1)     | ≥ $10,000                          |
| Uptime (widget + backend)   | ≥ 99.9%                            |

---

## Contact

For technical or partnership inquiries:  
Telegram: [https://t.me/blessedux](https://t.me/blessedux)  
Docs & Updates: [https://dobprotocol.com/doblink](https://dobprotocol.com/doblink)

---
