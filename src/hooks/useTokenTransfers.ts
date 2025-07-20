import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query'
import { EnrichedTokenTransfersResponse, NextPageParams } from '@/schemas/token-transfers'

export function useTokenTransfers(walletAddress: string) {
    return useInfiniteQuery<EnrichedTokenTransfersResponse, Error, InfiniteData<EnrichedTokenTransfersResponse>, string[], NextPageParams>({
        queryKey: ['token-transfers', walletAddress],
        queryFn: async ({ pageParam }) => {
            let url = `/api/wallets/${walletAddress}/token-transfers`
            if (pageParam) {
                url += `?block_number=${pageParam.block_number}&index=${pageParam.index}`
            }
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Failed to fetch token transfers')
            }
            return response.json() as Promise<EnrichedTokenTransfersResponse>
        },
        getNextPageParam: (lastPage) => lastPage.next_page_params,
        initialPageParam: null,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchInterval: 2 * 60 * 1000, 
        refetchOnWindowFocus: true, 
    })
}