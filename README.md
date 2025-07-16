# DOBLINK: Embeddable Payment Processor for DePIN Revenue Tokens

DOBLINK is a plug-and-play, embeddable payment processor for DePIN (Decentralized Physical Infrastructure Network) future revenue tokens. Projects in the DOB ecosystem can embed this widget on their landing page to allow users to buy/sell tokens directly, with full wallet and smart contract integration.

## Features

- **Embeddable Widget:** Add to any site as a React component or iframe
- **Wallet Connect:** MetaMask, Privy, and more
- **Buy/Sell Tokens:** Direct integration with DePIN smart contracts
- **Customizable:** Theme, logo, and text can be tailored to your brand
- **Portfolio Display:** Show user's holdings (optional)
- **Responsive & Modern UI:** Glassmorphism, mobile-friendly

## Example Usage

### React SDK

```jsx
import { DobLinkWidget } from "doblink-sdk";

<DobLinkWidget
  token={{
    address: "0x...",
    name: "E-Hive EV Charger",
    logo: "/Ehive-logo.png",
    apy: 18.7,
  }}
  theme="light"
  showPortfolio={false}
/>;
```

### Iframe Embed

```html
<iframe
  src="https://dobprotocol.com/embed/doblink?token=0x..."
  width="420"
  height="600"
  style="border:0; border-radius:16px; box-shadow:0 4px 24px rgba(80,112,255,0.08);"
></iframe>
```

## Customization

- Pass props or query params for logo, colors, and text
- Light/dark mode support
- Responsive for all devices

## Integration

- Connects to DePIN smart contracts for token sales
- Secure wallet connection and transaction signing
- Can be extended for analytics and backend integration

## Roadmap

## See `DRAPER_U_SPRINT.md` for the Draper University 2025 Program Technical Roadmap.

For more information, contact the DOB Protocol team or visit [dobprotocol.com](https://dobprotocol.com)
