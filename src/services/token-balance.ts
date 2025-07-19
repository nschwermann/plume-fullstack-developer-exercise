import axios from 'axios'
import { 
  TokenBalanceResponse, 
  TokenBalanceResponseSchema,
  EnrichedTokenBalanceResponse,
  EnrichedTokenBalanceItem
} from '@/schemas/token-balance'
import { TokenEnrichmentUtils, TOKEN_WHITELIST } from '@/utils/token-enrichment'

export class TokenBalanceService {
  private readonly baseUrl = 'https://explorer-plume-mainnet-1.t.conduit.xyz/api/v2'

  async getTokenBalances(address: string): Promise<EnrichedTokenBalanceResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/addresses/${address}/token-balances`)
      
      const validatedData = TokenBalanceResponseSchema.parse(response.data)
      
      return this.enrichTokenBalances(validatedData)
    } catch (error) {
      console.error('Error fetching token balances:', error)
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch token balances: ${error.message}`)
      }
      throw new Error('Failed to fetch token balances')
    }
  }

  private enrichTokenBalances(balances: TokenBalanceResponse): EnrichedTokenBalanceResponse {
    return balances
      .filter(balance => TOKEN_WHITELIST.has(balance.token.address.toLowerCase()))
      .map(balance => this.enrichTokenBalance(balance))
  }

  private enrichTokenBalance(balance: TokenBalanceResponse[0]): EnrichedTokenBalanceItem {
    const iconUrl = TokenEnrichmentUtils.getTokenIcon(balance.token.address.toLowerCase())
    const formattedValue = TokenEnrichmentUtils.formatTokenValue(balance.value, balance.token.decimals)
    const usdValue = TokenEnrichmentUtils.calculateUsdValue(formattedValue, balance.token.exchange_rate)

    return {
      token: {
        address: balance.token.address,
        decimals: balance.token.decimals,
        icon_url: iconUrl,
        name: balance.token.name,
        symbol: balance.token.symbol
      },
      value: balance.value,
      formatted_value: formattedValue,
      usd_value: usdValue
    }
  }

}