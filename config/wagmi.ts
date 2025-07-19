import { defineChain } from 'viem'

export const plumeMainnet = defineChain({
  id: 98866,
  name: 'Plume',
  nativeCurrency: {
    name: 'Plume',
    symbol: 'PLUME',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.plume.org'],
      webSocket: ['wss://rpc.plume.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Plume Explorer',
      url: 'https://explorer.plume.org',
    },
  },
  testnet: false,
})

export const plumeTestnet = defineChain({
  id: 98867,
  name: 'Plume Testnet',
  nativeCurrency: {
    name: 'Plume',
    symbol: 'PLUME',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.plume.org'],
      webSocket: ['wss://testnet-rpc.plume.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Plume Testnet Explorer',
      url: 'https://testnet-explorer.plume.org',
    },
  },
  testnet: true,
})

