# DOB Protocol Soroban Smart Contracts

This directory contains the Soroban smart contracts for the DOB Protocol, built with Rust and the Soroban SDK.

## Prerequisites

- Rust 1.70.0 or later
- Soroban CLI 20.0.0 or later
- Node.js 18.0.0 or later

## Setup

1. **Install Soroban CLI:**
   ```bash
   curl -sSfL https://soroban.stellar.org/install.sh | sh
   ```

2. **Install Rust (if not already installed):**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

### Build the contract
```bash
npm run build
```

### Run tests
```bash
npm run test
```

### Format code
```bash
npm run format
```

### Lint code
```bash
npm run lint
```

## Deployment

### Deploy to testnet
```bash
npm run deploy:testnet
```

### Deploy to mainnet
```bash
npm run deploy:mainnet
```

## Contract Functions

### Core Functions

- `init(admin: Address)` - Initialize the contract with admin address
- `invest(investor: Address, amount: i128, token_id: Symbol)` - Accept USDC investment
- `get_investment(investor: Address)` - Get investments by investor
- `get_all_investments()` - Get all investments
- `register_token(token_info: TokenInfo)` - Register token information
- `get_token_info()` - Get token information

### Data Structures

- `Investment` - Investment record with investor, amount, token, and timestamp
- `TokenInfo` - Token information with symbol, name, supply, and decimals

## Testing

The contract includes comprehensive tests covering:
- Contract initialization
- Investment functionality
- Error handling
- Data validation

Run tests with:
```bash
cargo test
```

## Error Codes

- `1` - Invalid amount
- `2` - Not authorized
- `3` - Token not found

## Security

- All functions include proper validation
- Admin-only functions are protected
- Amount validation prevents zero/negative investments
- Events are emitted for all state changes

## Integration

This contract integrates with:
- DOB Protocol backend API
- Widget frontend
- Stellar network for USDC transactions
- Analytics tracking system
