
## Getting Started

First, make .env.local file copy .env.example template

```bash
npm i
npm run generate:abis
npm run dev
```

## Challenge Requirements

**Your application should allow users to:**
- ✅ Connect their crypto wallets (e.g., MetaMask).
- 📊 View their Nest token balance for nALPHA and nTBILL.
- 🧾 View a list of the user's historical Nest token transactions, including:
  - Transaction hash
  - From/To addresses
  - Token name
  - Amount
  - Timestamp
- Bonus ideas: 
   - ✅ lookup other wallet addresses (click address in transction history to view details for that transaction)
   - ✅ copy address to clipboard
   - ✅ cache data serverside
   - ✅ loading state skeletons
   - ✅ TipJar! (Click 'Tip the Dev' to send me a tip)
   - ✅ show balance value for n-assets

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Chakra UI v3
- **Blockchain**: Hardhat, Viem, Wagmi for Web3 integration
- **Data Fetching**: TanStack Query for client-side, Axios for server-side
- **Validation**: Zod schemas throughout
- **Smart Contracts**: Solidity with Solady library dependencies

### Project Structure

#### Smart Contract Layer
- `contracts/` - Solidity smart contracts using Solady for gas-optimized utilities
- `hardhat.config.ts` - Hardhat configuration with Plume network support
- `ignition/modules/` - Hardhat Ignition deployment modules
- `test/` - Chai-based smart contract tests

#### Backend API Layer
- `src/app/api/` - Next.js API routes for external data fetching
- `src/services/` - Service classes with built-in caching mechanisms
- `src/schemas/` - Zod validation schemas for API responses

#### Frontend Layer
- `src/components/` - React components organized by feature/domain
- `src/hooks/` - Custom React hooks for data fetching
- `config/` - Wagmi/AppKit Web3 configuration and contract addresses

### Key Patterns

#### Service Layer Architecture
Services use in-memory caching with configurable TTL and stale-while-revalidate patterns. All services follow this structure:
- Zod schema validation for external API responses
- Built-in caching with cache headers
- Error handling with fallback to stale cache data
- TypeScript interfaces for cache metadata

#### Component Organization
- `layout/` - Layout components with wallet connection logic
- `user/` - User-specific components (balances, transactions)
- `tipjar/` - TipJar contract interaction components
- `common/` - Shared UI components
- `chakra_config/` - Chakra UI theme and provider setup

#### Web3 Integration
- Wagmi hooks for blockchain interactions
- Viem for low-level blockchain operations
- AppKit for wallet connection UI
- Contract addresses managed in `config/contracts.ts`
- TypeChain-generated type-safe contract interfaces

### Smart Contract Architecture
The TipJar contract demonstrates:
- Solady library usage for gas optimization
- Ownable pattern for access control
- SafeTransferLib for secure ETH transfers
- Event emission for transaction tracking

## Extras
Because this challenge did not require much blockchain interaction only a simple wallet connection and using APIs from an indexer I wanted to demonstrate my talents for blockchain as well.

I originally had intended to allow users to deposit pUSD into a boring vault and mint nALPHA or nTBILL. However, after reviewing the contracts I saw that this required an authorization from the server which did not make it possible. 

I noticed that the PredicateClient is using the diamond storage pattern which I have found extremly useful when developing other upgradable contracts! Also, its using Solmate another library I am familiar with however I have been using Solady instead as its actively maintained.

So I decided to make just a simple "TipJar" contract which will allow users of the platform to send me some PLUME.

## Demo
[Demo](https://nest-mini.vercel.app/)