# DOBSWAP Protocol

A decentralized exchange for Real World Asset (RWA) tokens with verified revenue backing.

## Project Structure

```
dobswap/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── config/         # Configuration files
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── contracts/               # Smart contracts
│   ├── src/                # Contract source files
│   │   ├── core/          # Core protocol contracts
│   │   ├── tokens/        # Token contracts
│   │   ├── interfaces/    # Contract interfaces
│   │   └── libraries/     # Contract libraries
│   ├── test/              # Contract tests
│   ├── scripts/           # Deployment scripts
│   └── package.json       # Contract dependencies
│
├── backend/                # Backend services
│   ├── src/               # Backend source code
│   │   ├── api/          # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data models
│   │   └── utils/        # Utility functions
│   └── package.json      # Backend dependencies
│
└── docs/                  # Documentation
    ├── architecture/     # Architecture diagrams
    ├── api/             # API documentation
    └── contracts/       # Smart contract documentation
```

## Technology Stack

### Frontend

- React 18
- TypeScript
- TailwindCSS
- Vite
- Privy (Authentication)
- Wagmi (Ethereum interactions)

### Smart Contracts

- Solidity
- Hardhat
- OpenZeppelin
- Ethers.js

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+
- Bun
- Git

### Frontend Setup

```bash
cd frontend
bun install
bun run dev
```

### Smart Contract Setup

```bash
cd contracts
bun install
bun run compile
```

### Backend Setup

```bash
cd backend
bun install
bun run dev
```

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Write tests
4. Submit a pull request

## Testing

### Frontend Tests

```bash
cd frontend
bun run test
```

### Smart Contract Tests

```bash
cd contracts
bun run test
```

### Backend Tests

```bash
cd backend
bun run test
```

## Deployment

### Frontend

- Netlify (Production)
- Vercel (Staging)

### Smart Contracts

- Ethereum Mainnet
- Ethereum Testnets (Goerli, Sepolia)

### Backend

- AWS (Production)
- Heroku (Staging)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
