"use client"

import { useAccount } from 'wagmi'
import { ConnectWalletCard } from '@/components/wallet/ConnectWalletCard'
import { UserLayout } from '@/components/layout/UserLayout'
import { BaseLayout } from '@/components/layout/BaseLayout'


export function AppLayout() {
  const { isConnected, address } = useAccount()

  if (!isConnected) {
    return <ConnectWalletCard />
  }

  return (
    <BaseLayout>
      <UserLayout walletAddress={address} />
    </BaseLayout>
  )
}