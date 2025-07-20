import { useQuery } from '@tanstack/react-query'
import { TokenPriceResponse } from '@/schemas/token-price'

export function useTokenPrice() {
    return useQuery<number>({
        queryKey: ['token-price'],
        queryFn: async () => {
            const response = await fetch('/api/token-price')
            if (!response.ok) {
                throw new Error('Failed to fetch Token price')
            }
            const data: TokenPriceResponse = await response.json()
            return data.price
        },
        staleTime: 30 * 1000, 
        gcTime: 5 * 60 * 1000, 
        refetchInterval: 60 * 1000, 
        refetchOnWindowFocus: true, 
    })
}