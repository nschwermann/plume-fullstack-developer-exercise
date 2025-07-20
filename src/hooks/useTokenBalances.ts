import { useQuery } from '@tanstack/react-query'
import { EnrichedTokenBalanceResponse } from '@/schemas/token-balance'

export function useTokenBalances(walletAddress: string) {
    return useQuery<EnrichedTokenBalanceResponse>({
        queryKey: ['tokenBalances', walletAddress],
        queryFn: async () => {
            const response = await fetch(`/api/wallets/${walletAddress}/token-balances`)
            if (!response.ok) {
                throw new Error('Failed to fetch token balances')
            }
            return response.json()
        },
        staleTime: 30 * 1000, 
        gcTime: 5 * 60 * 1000, 
        refetchInterval: 2 * 60 * 1000, 
        refetchOnWindowFocus: true,
    })
}