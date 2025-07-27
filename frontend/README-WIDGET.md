# DOB Link Embeddable Widget

A lightweight, embeddable widget that allows any website to integrate DOB Protocol token investments.

## 🚀 Quick Start

### 1. Include the Script

Add this script tag to your HTML:

```html
<script src="https://dobprotocol.com/link.js"></script>
```

### 2. Initialize the Widget

```javascript
const widget = createDobLinkWidget({
  tokenId: "EVCHARGER001",
  theme: "dark",
  position: "bottom-right",
});

widget.mount();
```

## 📋 Configuration Options

| Option         | Type                                                         | Default        | Description                |
| -------------- | ------------------------------------------------------------ | -------------- | -------------------------- |
| `tokenId`      | string                                                       | 'default'      | The token ID to display    |
| `theme`        | 'light' \| 'dark'                                            | 'dark'         | Widget theme               |
| `position`     | 'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' | 'bottom-right' | Widget position            |
| `customStyles` | object                                                       | {}             | Custom CSS styles to apply |

## 🎯 Usage Examples

### Basic Usage

```javascript
const widget = createDobLinkWidget();
widget.mount();
```

### Custom Configuration

```javascript
const widget = createDobLinkWidget({
  tokenId: "SOLARFARM002",
  theme: "light",
  position: "top-left",
  customStyles: {
    backgroundColor: "#10b981",
    color: "white",
  },
});
widget.mount("#my-container");
```

### Mount to Specific Element

```javascript
const widget = createDobLinkWidget();
widget.mount("#my-widget-container");
```

### Remove Widget

```javascript
widget.unmount();
```

## 🏗️ Development

### Build the Widget

```bash
npm run build:widget
```

### Test Locally

1. Build the widget: `npm run build:widget`
2. Serve the test file: `python3 -m http.server 3001`
3. Open: `http://localhost:3001/test-widget.html`

### Bundle Size

- ES Module: ~44KB (10KB gzipped)
- UMD: ~18KB (6KB gzipped)

## 🎨 Customization

The widget supports both light and dark themes, and can be positioned in any corner of the screen. You can also apply custom styles for further branding.

## 🔧 Technical Details

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Bundle Formats**: ES Module, UMD
- **Dependencies**: External (React, ReactDOM)

## 📱 Mobile Support

The widget is fully responsive and works on all mobile devices. The floating button adapts to screen size and the modal is mobile-optimized.

## 🔒 Security

- No external dependencies loaded at runtime
- All code is bundled and minified
- No tracking or analytics included
- CSP-friendly

## 🚀 Next Steps

- [ ] Wallet connection integration
- [ ] Stellar USDC on-ramp
- [ ] Smart contract integration
- [ ] Analytics dashboard
- [ ] Multi-token support
