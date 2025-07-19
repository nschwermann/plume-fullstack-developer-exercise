import axios from 'axios'
import { 
  TokenTransfersResponse,
  TokenTransfersResponseSchema,
  EnrichedTokenTransfersResponse,
  EnrichedTokenTransferItem,
  TokenTransferItem
} from '@/schemas/token-transfers'
import { TokenEnrichmentUtils, TOKEN_WHITELIST } from '@/utils/token-enrichment'

export class TokenTransfersService {
  private readonly baseUrl = 'https://explorer-plume-mainnet-1.t.conduit.xyz/api/v2'

  async getTokenTransfers(
    address: string, 
    nextPageParams?: { block_number: number; index: number }
  ): Promise<EnrichedTokenTransfersResponse> {
    try {
      let url = `${this.baseUrl}/addresses/${address}/token-transfers?type=ERC-20`
      
      if (nextPageParams) {
        url += `&block_number=${nextPageParams.block_number}&index=${nextPageParams.index}`
      }

      const response = await axios.get(url)
      const validatedData = TokenTransfersResponseSchema.parse(response.data)
      
      return this.enrichTokenTransfers(validatedData, address)
    } catch (error) {
      console.error('Error fetching token transfers:', error)
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
      .filter(transfer => TOKEN_WHITELIST.has(transfer.token.address.toLowerCase()))
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
    const iconUrl = TokenEnrichmentUtils.getTokenIcon(transfer.token.address.toLowerCase())
    const formattedAmount = TokenEnrichmentUtils.formatTokenValue(transfer.total.value, transfer.total.decimals)
    const usdAmount = TokenEnrichmentUtils.calculateUsdValue(formattedAmount, transfer.token.exchange_rate)
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
        address: transfer.token.address,
        decimals: transfer.token.decimals,
        icon_url: iconUrl,
        name: transfer.token.name,
        symbol: transfer.token.symbol
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
}