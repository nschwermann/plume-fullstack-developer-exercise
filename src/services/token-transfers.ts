import axios from 'axios'
import { 
  TokenTransfersResponse,
  TokenTransfersResponseSchema,
  EnrichedTokenTransfersResponse,
  EnrichedTokenTransferItem,
  TokenTransferItem
} from '@/schemas/token-transfers'
import { TokenEnrichmentUtils, TOKEN_WHITELIST } from '@/utils/token-enrichment'

interface TransferCache {
  data: EnrichedTokenTransfersResponse
  timestamp: number
  cacheKey: string
}

interface TransferServiceResponse {
  data: EnrichedTokenTransfersResponse
  cached: boolean
  stale?: boolean
}

export class TokenTransfersService {
  private static transferCache: Map<string, TransferCache> = new Map()
  private static readonly CACHE_DURATION = 30 * 1000
  private readonly baseUrl = 'https://explorer-plume-mainnet-1.t.conduit.xyz/api/v2'

  async getTokenTransfers(
    address: string, 
    nextPageParams?: { block_number: number; index: number }
  ): Promise<TransferServiceResponse> {
    try {
      const normalizedAddress = address.toLowerCase()
      const cacheKey = this.generateCacheKey(normalizedAddress, nextPageParams)
      
      // Check if we have valid cached data
      const cached = TokenTransfersService.transferCache.get(cacheKey)
      if (cached && this.isCacheValid(cached)) {
        return {
          data: cached.data,
          cached: true
        }
      }
      let url = `${this.baseUrl}/addresses/${address}/token-transfers?type=ERC-20`
      
      if (nextPageParams) {
        url += `&block_number=${nextPageParams.block_number}&index=${nextPageParams.index}`
      }

      const response = await axios.get(url)
      const validatedData = TokenTransfersResponseSchema.parse(response.data)
      const enrichedData = this.enrichTokenTransfers(validatedData, address)

      // Update cache
      TokenTransfersService.transferCache.set(cacheKey, {
        data: enrichedData,
        timestamp: Date.now(),
        cacheKey
      })

      return {
        data: enrichedData,
        cached: false
      }

    } catch (error) {
      console.error('Error fetching token transfers:', error)
      
      // Return cached data if available, even if expired
      const cacheKey = this.generateCacheKey(address.toLowerCase(), nextPageParams)
      const cached = TokenTransfersService.transferCache.get(cacheKey)
      if (cached) {
        return {
          data: cached.data,
          cached: true,
          stale: true
        }
      }

      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch token transfers: ${error.message}`)
      }
      throw new Error('Failed to fetch token transfers')
    }
  }

  private enrichTokenTransfers(
    transfers: TokenTransfersResponse, 
    walletAddress: string
  ): EnrichedTokenTransfersResponse {
    const enrichedItems = transfers.items
      .filter(transfer => 
        transfer.token.address && 
        transfer.token.decimals && 
        transfer.token.name && 
        transfer.token.symbol &&
        TOKEN_WHITELIST.has(transfer.token.address.toLowerCase())
      )
      .map(transfer => 
        this.enrichTokenTransfer(transfer, walletAddress)
      )

    return {
      items: enrichedItems,
      next_page_params: transfers.next_page_params
    }
  }

  private enrichTokenTransfer(
    transfer: TokenTransferItem, 
    walletAddress: string
  ): EnrichedTokenTransferItem {
    // At this point, we know these are not null due to filtering
    const address = transfer.token.address!
    const decimals = transfer.token.decimals!
    const name = transfer.token.name!
    const symbol = transfer.token.symbol!

    const iconUrl = TokenEnrichmentUtils.getTokenIcon(address.toLowerCase())
    const formattedAmount = TokenEnrichmentUtils.formatTokenValue(transfer.total.value, transfer.total.decimals)
    const usdAmount = transfer.token.exchange_rate 
      ? TokenEnrichmentUtils.calculateUsdValue(formattedAmount, transfer.token.exchange_rate)
      : '-'
    const direction = this.getTransferDirection(transfer, walletAddress)

    return {
      block_hash: transfer.block_hash,
      block_number: transfer.block_number,
      from: {
        ens_domain_name: transfer.from.ens_domain_name,
        address: transfer.from.hash,
        is_contract: transfer.from.is_contract,
        name: transfer.from.name
      },
      timestamp: transfer.timestamp,
      to: {
        ens_domain_name: transfer.to.ens_domain_name,
        address: transfer.to.hash,
        is_contract: transfer.to.is_contract,
        name: transfer.to.name
      },
      token: {
        address,
        decimals,
        icon_url: iconUrl,
        name,
        symbol
      },
      total: transfer.total,
      transaction_hash: transfer.transaction_hash,
      type: transfer.type,
      formatted_amount: formattedAmount,
      usd_amount: usdAmount,
      direction
    }
  }


  private getTransferDirection(
    transfer: TokenTransferItem, 
    walletAddress: string
  ): 'in' | 'out' {
    return transfer.to.hash.toLowerCase() === walletAddress.toLowerCase() ? 'in' : 'out'
  }

  private generateCacheKey(address: string, nextPageParams?: { block_number: number; index: number }): string {
    const baseKey = `transfers-${address}`
    if (nextPageParams) {
      return `${baseKey}-${nextPageParams.block_number}-${nextPageParams.index}`
    }
    return `${baseKey}-first-page`
  }

  private isCacheValid(cache: TransferCache): boolean {
    return Date.now() - cache.timestamp < TokenTransfersService.CACHE_DURATION
  }

  getCacheAge(address: string, nextPageParams?: { block_number: number; index: number }): number | null {
    const cacheKey = this.generateCacheKey(address.toLowerCase(), nextPageParams)
    const cached = TokenTransfersService.transferCache.get(cacheKey)
    if (!cached) return null
    return Date.now() - cached.timestamp
  }
}