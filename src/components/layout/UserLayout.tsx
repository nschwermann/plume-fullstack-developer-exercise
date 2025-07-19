
import { Balances } from '@/components/user/Balances'
import { Transactions } from '@/components/user/Transactions'


interface UserLayoutProps {
  walletAddress: string
}

export function UserLayout({ walletAddress }: UserLayoutProps) {


  return (
    <>
      <Balances walletAddress={walletAddress} />
      <Transactions walletAddress={walletAddress} />
    </>
  )
}