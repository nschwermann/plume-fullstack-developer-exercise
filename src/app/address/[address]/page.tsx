import { BaseLayout } from '@/components/layout/BaseLayout'
import { UserLayout } from '@/components/layout/UserLayout'

interface AddressPageProps {
  params: Promise<{
    address: string
  }>
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params

  return (
    <BaseLayout>
      <UserLayout walletAddress={address} />
    </BaseLayout>
  )
}
