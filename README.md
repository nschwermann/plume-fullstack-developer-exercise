

## Getting Started

First, make .env.local file copy .env.example template


```bash
npm i
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
    - ✅ lookup other wallet addresses
   - ✅ loading state skeletons

## Stack Used
- Next.js client and server
- Wagmi for wallet connection
- Viem blockchain interaction
- Chakra UI Components
- Transtack client side query
- Zod data validations
- Axios server side fetch
