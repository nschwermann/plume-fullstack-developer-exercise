
import { Balances } from '@/components/user/Balances'
import { Transactions } from '@/components/user/Transactions'
import { Info } from '@/components/user/Info'


interface UserLayoutProps {
  walletAddress: string
}

export function UserLayout({ walletAddress }: UserLayoutProps) {


  return (
    <>
      <Info walletAddress={walletAddress} />
      <Balances walletAddress={walletAddress} />
      <Transactions walletAddress={walletAddress} />
    </>
  )
}