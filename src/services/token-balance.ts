import axios from 'axios'
import { 
  TokenBalanceResponse, 
  TokenBalanceResponseSchema,
  EnrichedTokenBalanceResponse,
  EnrichedTokenBalanceItem
} from '@/schemas/token-balance'
import { TokenEnrichmentUtils, TOKEN_WHITELIST } from '@/utils/token-enrichment'

interface BalanceCache {
  data: EnrichedTokenBalanceResponse
  timestamp: number
  address: string
}

interface BalanceServiceResponse {
  data: EnrichedTokenBalanceResponse
  cached: boolean
  stale?: boolean
}

export class TokenBalanceService {
  private static balanceCache: Map<string, BalanceCache> = new Map()
  private static readonly CACHE_DURATION = 60 * 1000 
  private readonly baseUrl = 'https://explorer-plume-mainnet-1.t.conduit.xyz/api/v2'

  async getTokenBalances(address: string): Promise<BalanceServiceResponse> {
    try {
      const normalizedAddress = address.toLowerCase()
      
      // Check if we have valid cached data
      const cached = TokenBalanceService.balanceCache.get(normalizedAddress)
      if (cached && this.isCacheValid(cached)) {
        return {
          data: cached.data,
          cached: true
        }
      }

      // Fetch fresh data
      const response = await axios.get(`${this.baseUrl}/addresses/${address}/token-balances`)
      const validatedData = TokenBalanceResponseSchema.parse(response.data)
      const enrichedData = this.enrichTokenBalances(validatedData)

      // Update cache
      TokenBalanceService.balanceCache.set(normalizedAddress, {
        data: enrichedData,
        timestamp: Date.now(),
        address: normalizedAddress
      })

      return {
        data: enrichedData,
        cached: false
      }

    } catch (error) {
      console.error('Error fetching token balances:', error)
      
      // Return cached data if available, even if expired
      const cached = TokenBalanceService.balanceCache.get(address.toLowerCase())
      if (cached) {
        return {
          data: cached.data,
          cached: true,
          stale: true
        }
      }

      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch token balances: ${error.message}`)
      }
      throw new Error('Failed to fetch token balances')
    }
  }

  private enrichTokenBalances(balances: TokenBalanceResponse): EnrichedTokenBalanceResponse {
    return balances
      .filter(balance => 
        balance.token.address && 
        balance.token.decimals && 
        balance.token.name && 
        balance.token.symbol &&
        TOKEN_WHITELIST.has(balance.token.address.toLowerCase())
      )
      .map(balance => this.enrichTokenBalance(balance))
  }

  private enrichTokenBalance(balance: TokenBalanceResponse[0]): EnrichedTokenBalanceItem {
    // At this point, we know these are not null due to filtering
    const address = balance.token.address!
    const decimals = balance.token.decimals!
    const name = balance.token.name!
    const symbol = balance.token.symbol!

    const iconUrl = TokenEnrichmentUtils.getTokenIcon(address.toLowerCase())
    const formattedValue = TokenEnrichmentUtils.formatTokenValue(balance.value, decimals)
    const usdValue = balance.token.exchange_rate 
      ? TokenEnrichmentUtils.calculateUsdValue(formattedValue, balance.token.exchange_rate)
      : '-'

    return {
      token: {
        address,
        decimals,
        icon_url: iconUrl,
        name,
        symbol
      },
      value: balance.value,
      formatted_value: formattedValue,
      usd_value: usdValue
    }
  }

  private isCacheValid(cache: BalanceCache): boolean {
    return Date.now() - cache.timestamp < TokenBalanceService.CACHE_DURATION
  }

  getCacheAge(address: string): number | null {
    const cached = TokenBalanceService.balanceCache.get(address.toLowerCase())
    if (!cached) return null
    return Date.now() - cached.timestamp
  }

}