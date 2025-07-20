'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { config, networks, projectId, wagmiAdapter } from '../config'
import { plumeMainnet } from 'viem/chains'

const queryClient = new QueryClient()

const metadata = {
  name: 'Nest Mini',
  description: 'Plume Fullstack Exercise',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
  icons: ['/favicon.ico'],
}

// Initialize AppKit outside the component render cycle
if (!projectId) {
  console.error("AppKit Initialization Error: Project ID is missing.");
} else {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId,
    networks: networks,
    defaultNetwork: plumeMainnet,
    metadata,
    features: { 
        analytics: false,
        connectMethodsOrder : ['wallet']
    },
  })
}

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  // Calculate initial state for Wagmi SSR hydration
  const initialState = cookieToInitialState(config as Config, cookies)

  return (
    <WagmiProvider config={config as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
