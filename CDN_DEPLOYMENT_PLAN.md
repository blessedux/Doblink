# DOB Link Widget CDN Deployment Plan

## Overview

This document outlines the strategy for deploying the DOB Link widget to a CDN for global distribution and optimal performance.

## 1. CDN Architecture

### 1.1 Primary CDN Provider

- **Provider:** Cloudflare
- **Reasoning:**
  - Global edge network with 200+ locations
  - Excellent performance and reliability
  - Built-in DDoS protection
  - Cost-effective for high-traffic applications
  - Easy integration with custom domains

### 1.2 Secondary CDN (Backup)

- **Provider:** AWS CloudFront
- **Reasoning:**
  - Redundancy and failover capability
  - Integration with AWS ecosystem
  - Advanced caching strategies

## 2. File Structure for CDN

```
cdn.dobprotocol.com/
├── widget.js                 # Main widget script
├── widget.css                # Widget styles
├── widget.min.js             # Minified version
├── widget.min.css            # Minified styles
├── versions/
│   ├── v1.0.0/
│   │   ├── widget.js
│   │   └── widget.css
│   └── latest/               # Symlink to current version
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
└── api/
    └── health                # Health check endpoint
```

## 3. Build and Deployment Pipeline

### 3.1 Build Process

```bash
# Build widget for production
npm run build:widget

# Minify and optimize
npm run minify:widget

# Generate version files
npm run version:widget

# Upload to CDN
npm run deploy:cdn
```

### 3.2 Versioning Strategy

- **Semantic Versioning:** v1.0.0, v1.1.0, etc.
- **Latest Version:** Always available at `/latest/`
- **Specific Versions:** Available at `/versions/v1.0.0/`
- **Backward Compatibility:** Maintain support for previous versions

### 3.3 Deployment Scripts

```javascript
// deploy-cdn.js
const AWS = require("aws-sdk");
const cloudflare = require("cloudflare");

async function deployToCDN() {
  // 1. Build widget
  await buildWidget();

  // 2. Upload to Cloudflare
  await uploadToCloudflare();

  // 3. Upload to AWS CloudFront (backup)
  await uploadToCloudFront();

  // 4. Update version manifest
  await updateVersionManifest();

  // 5. Run health checks
  await runHealthChecks();
}
```

## 4. Widget Script Optimization

### 4.1 Code Splitting

```javascript
// widget.js - Main entry point
import { createWidget } from "./core/widget.js";
import { loadStyles } from "./utils/styles.js";
import { analytics } from "./utils/analytics.js";

// Lazy load components
const loadWalletIntegration = () => import("./integrations/wallet.js");
const loadPaymentProcessor = () => import("./integrations/payment.js");
```

### 4.2 Bundle Optimization

- **Tree Shaking:** Remove unused code
- **Minification:** Reduce file size by 60-70%
- **Gzip Compression:** Enable on CDN
- **Brotli Compression:** Enable for modern browsers

### 4.3 Caching Strategy

```http
# Cache headers for widget files
Cache-Control: public, max-age=31536000, immutable
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
```

## 5. Performance Optimization

### 5.1 Loading Strategy

```html
<!-- Async loading for non-critical resources -->
<script src="https://cdn.dobprotocol.com/widget.js" async></script>

<!-- Preload critical resources -->
<link rel="preload" href="https://cdn.dobprotocol.com/widget.css" as="style" />
<link
  rel="preload"
  href="https://cdn.dobprotocol.com/assets/icons/logo.svg"
  as="image"
/>
```

### 5.2 Resource Hints

```html
<!-- DNS prefetch for external APIs -->
<link rel="dns-prefetch" href="//api.dobprotocol.com" />
<link rel="dns-prefetch" href="//supabase.co" />

<!-- Preconnect for critical domains -->
<link rel="preconnect" href="https://api.dobprotocol.com" />
<link rel="preconnect" href="https://supabase.co" />
```

### 5.3 Critical CSS Inlining

```javascript
// Inline critical CSS for faster rendering
const criticalCSS = `
  .dob-widget { position: fixed; z-index: 1000; }
  .dob-widget-button { background: #3E54D3; }
`;

// Inject critical CSS immediately
const style = document.createElement("style");
style.textContent = criticalCSS;
document.head.appendChild(style);
```

## 6. Security Considerations

### 6.1 Content Security Policy (CSP)

```http
Content-Security-Policy:
  default-src 'self' https://cdn.dobprotocol.com;
  script-src 'self' 'unsafe-inline' https://cdn.dobprotocol.com;
  style-src 'self' 'unsafe-inline' https://cdn.dobprotocol.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.dobprotocol.com https://supabase.co;
```

### 6.2 Subresource Integrity (SRI)

```html
<script
  src="https://cdn.dobprotocol.com/widget.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
></script>
```

### 6.3 Rate Limiting

- **API Calls:** 100 requests per minute per IP
- **Widget Loads:** 1000 loads per minute per domain
- **Error Monitoring:** Alert on unusual patterns

## 7. Monitoring and Analytics

### 7.1 Performance Monitoring

```javascript
// Performance metrics collection
const performanceMetrics = {
  loadTime: performance.now() - startTime,
  domContentLoaded:
    performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
  firstContentfulPaint: performance.getEntriesByType("paint")[0].startTime,
};

// Send to analytics
analytics.track("widget_performance", performanceMetrics);
```

### 7.2 Error Tracking

```javascript
// Global error handler
window.addEventListener("error", (event) => {
  analytics.track("widget_error", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
  });
});
```

### 7.3 Health Checks

```javascript
// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    version: process.env.WIDGET_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

## 8. Deployment Environments

### 8.1 Development

- **URL:** `https://dev-cdn.dobprotocol.com`
- **Purpose:** Testing new features
- **Cache:** Disabled for rapid iteration

### 8.2 Staging

- **URL:** `https://staging-cdn.dobprotocol.com`
- **Purpose:** Pre-production testing
- **Cache:** Short TTL (5 minutes)

### 8.3 Production

- **URL:** `https://cdn.dobprotocol.com`
- **Purpose:** Live widget distribution
- **Cache:** Long TTL (1 year for static assets)

## 9. Rollback Strategy

### 9.1 Automatic Rollback

```javascript
// Monitor error rates and performance
const errorThreshold = 0.05; // 5% error rate
const performanceThreshold = 3000; // 3 seconds

if (errorRate > errorThreshold || avgLoadTime > performanceThreshold) {
  await rollbackToPreviousVersion();
  await notifyTeam("Automatic rollback triggered");
}
```

### 9.2 Manual Rollback

```bash
# Rollback to previous version
npm run rollback:cdn --version=v1.0.0

# Update latest symlink
ln -sf /versions/v1.0.0 /latest
```

## 10. Testing Strategy

### 10.1 Automated Testing

```javascript
// Test widget loading in different environments
describe("Widget CDN Tests", () => {
  test("loads from CDN successfully", async () => {
    const response = await fetch("https://cdn.dobprotocol.com/widget.js");
    expect(response.status).toBe(200);
  });

  test("widget renders correctly", async () => {
    // Test widget rendering in headless browser
  });

  test("performance meets requirements", async () => {
    // Test load time < 2 seconds
  });
});
```

### 10.2 Manual Testing

- **Cross-browser testing:** Chrome, Firefox, Safari, Edge
- **Mobile testing:** iOS Safari, Chrome Mobile
- **Network conditions:** 3G, 4G, WiFi
- **Geographic testing:** Different CDN edge locations

## 11. Implementation Timeline

### Phase 1: Infrastructure Setup (Week 1-2)

- [ ] Set up Cloudflare account and configuration
- [ ] Configure custom domain (cdn.dobprotocol.com)
- [ ] Set up AWS CloudFront as backup
- [ ] Implement build pipeline

### Phase 2: Widget Optimization (Week 3-4)

- [ ] Optimize widget bundle size
- [ ] Implement code splitting
- [ ] Add performance monitoring
- [ ] Set up error tracking

### Phase 3: Testing and Deployment (Week 5-6)

- [ ] Comprehensive testing across environments
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment

### Phase 4: Monitoring and Maintenance (Week 7+)

- [ ] Set up monitoring dashboards
- [ ] Implement alerting
- [ ] Document maintenance procedures
- [ ] Plan for future updates

## 12. Cost Estimation

### Cloudflare

- **Free Tier:** Up to 10,000 requests/day
- **Pro Plan:** $20/month for higher limits
- **Business Plan:** $200/month for advanced features

### AWS CloudFront

- **Data Transfer:** $0.085 per GB
- **Requests:** $0.0075 per 10,000 requests
- **Estimated Monthly Cost:** $50-200 depending on usage

### Total Estimated Cost

- **Development Phase:** $100/month
- **Production Phase:** $300-500/month (depending on traffic)

## 13. Success Metrics

### Performance Metrics

- **Load Time:** < 2 seconds on 3G connection
- **Availability:** 99.9% uptime
- **Cache Hit Rate:** > 95%

### Business Metrics

- **Widget Load Success Rate:** > 99%
- **User Engagement:** Track widget interactions
- **Conversion Rate:** Monitor token purchases

### Technical Metrics

- **Error Rate:** < 0.1%
- **Bundle Size:** < 100KB gzipped
- **Time to Interactive:** < 3 seconds

## 14. Future Considerations

### 14.1 Advanced Features

- **A/B Testing:** Different widget versions
- **Personalization:** User-specific configurations
- **Analytics Dashboard:** Real-time widget performance

### 14.2 Scalability

- **Micro-frontend Architecture:** Modular widget components
- **Edge Computing:** Server-side rendering at CDN edge
- **Progressive Enhancement:** Graceful degradation

### 14.3 Integration

- **CMS Integration:** WordPress, Shopify plugins
- **Framework Support:** React, Vue, Angular components
- **API Gateway:** Centralized widget management

---

_This plan will be updated as the project evolves and new requirements emerge._
