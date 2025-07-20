import axios from 'axios'
import { CoinGeckoResponseSchema, TokenPriceServiceResponse } from '@/schemas/token-price'

interface PriceCache {
  price: number
  timestamp: number
}

export class TokenPriceService {
  private static priceCache: PriceCache | null = null
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
  private readonly baseUrl = 'https://api.coingecko.com/api/v3'

  async getTokenPrice(): Promise<TokenPriceServiceResponse> {
    try {
      // Check if we have valid cached data
      if (TokenPriceService.priceCache && this.isCacheValid()) {
        return {
          price: TokenPriceService.priceCache.price,
          cached: true
        }
      }

      // Fetch fresh data from CoinGecko
      const response = await axios.get(`${this.baseUrl}/simple/price?ids=plume&vs_currencies=usd`)
      
      const validatedData = CoinGeckoResponseSchema.parse(response.data)
      const price = validatedData.plume.usd

      // Update cache
      TokenPriceService.priceCache = {
        price,
        timestamp: Date.now()
      }

      return {
        price,
        cached: false
      }

    } catch (error) {
      console.error('Error fetching token price:', error)
      
      // Return cached data if available, even if expired
      if (TokenPriceService.priceCache) {
        return {
          price: TokenPriceService.priceCache.price,
          cached: true,
          stale: true
        }
      }

      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch token price: ${error.message}`)
      }
      throw new Error('Failed to fetch token price')
    }
  }

  private isCacheValid(): boolean {
    if (!TokenPriceService.priceCache) return false
    return Date.now() - TokenPriceService.priceCache.timestamp < TokenPriceService.CACHE_DURATION
  }

  getCacheAge(): number | null {
    if (!TokenPriceService.priceCache) return null
    return Date.now() - TokenPriceService.priceCache.timestamp
  }
}