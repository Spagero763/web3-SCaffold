# Web3 Scaffold

A modern Web3 development scaffold built with Next.js 15, featuring pre-built smart contract interactions, wallet connectivity, and AI-powered contract generation.

## Features

- **Multi-Chain Support** - Ethereum, Polygon, Arbitrum, Optimism, and Base
- **Wallet Integration** - RainbowKit and Reown AppKit for seamless wallet connections  
- **Pre-built Contracts** - 10+ ready-to-use smart contract interactions
- **AI Contract Generator** - Generate custom contract interfaces using Genkit AI
- **Transaction Management** - Built-in transaction history and status tracking
- **Modern UI** - Tailwind CSS with Radix UI components

## Quick Start

\\\ash
# Install dependencies
npm install

# Start development server
npm run dev

# Start AI features (in separate terminal)
npm run genkit:dev
\\\

Open [http://localhost:9002](http://localhost:9002) to view the application.

## Available Contracts

| Contract | Description |
|----------|-------------|
| Tip Jar | Send and receive ETH tips |
| Badge NFT | Mint and manage NFT badges |
| Time Capsule | Lock funds with time-based release |
| On-chain Notepad | Store notes on the blockchain |
| Poll Creator | Create and participate in polls |
| Simple Token | Basic ERC20 token operations |
| Airdropper | Batch token distribution |
| Task Bounty | Create bounties for tasks |
| Daily Check-in | Maintain streak-based rewards |
| Donation Tracker | Track charitable donations |

## Project Structure

\\\
src/
 ai/              # Genkit AI flows
 app/             # Next.js app router pages
 components/      # Reusable UI components
 contracts/       # Contract ABIs and definitions
 hooks/           # Custom React hooks
 lib/             # Utility functions and constants
 providers/       # Context providers
\\\

## Custom Hooks

- \useContractWrite\ - Simplified contract write operations with state management
- \useRecentTransactions\ - Track and persist transaction history

## Configuration

Create a \.env.local\ file:

\\\env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
GOOGLE_GENAI_API_KEY=your_genai_key
\\\

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Web3**: Wagmi, Viem, RainbowKit
- **AI**: Google Genkit
- **Styling**: Tailwind CSS, Radix UI
- **Forms**: React Hook Form + Zod

## Scripts

| Command | Description |
|---------|-------------|
| \
pm run dev\ | Start development server |
| \
pm run build\ | Build for production |
| \
pm run lint\ | Run ESLint |
| \
pm run typecheck\ | TypeScript type checking |
| \
pm run genkit:dev\ | Start Genkit AI server |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
