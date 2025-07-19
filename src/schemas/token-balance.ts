import { z } from 'zod'

export const TokenSchema = z.object({
  address: z.string().nullable(),
  address_hash: z.string().nullable(),
  circulating_market_cap: z.string().nullable(),
  decimals: z.string().nullable(),
  exchange_rate: z.string().nullable(),
  holders: z.string().nullable(),
  holders_count: z.string().nullable(),
  icon_url: z.string().nullable(),
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  total_supply: z.string().nullable(),
  type: z.string().nullable(),
  volume_24h: z.string().nullable()
})

export const TokenBalanceItemSchema = z.object({
  token: TokenSchema,
  token_id: z.any().nullable(), 
  token_instance: z.any().nullable(),
  value: z.string()
})

export const TokenBalanceResponseSchema = z.array(TokenBalanceItemSchema)

export const EnrichedTokenSchema = z.object({
  address: z.string(),
  decimals: z.string(),
  icon_url: z.string(),
  name: z.string(),
  symbol: z.string()
})

export const EnrichedTokenBalanceItemSchema = z.object({
  token: EnrichedTokenSchema,
  value: z.string(),
  formatted_value: z.string(),
  usd_value: z.string()
})

export const EnrichedTokenBalanceResponseSchema = z.array(EnrichedTokenBalanceItemSchema)

export type Token = z.infer<typeof TokenSchema>
export type TokenBalanceItem = z.infer<typeof TokenBalanceItemSchema>
export type TokenBalanceResponse = z.infer<typeof TokenBalanceResponseSchema>
export type EnrichedToken = z.infer<typeof EnrichedTokenSchema>
export type EnrichedTokenBalanceItem = z.infer<typeof EnrichedTokenBalanceItemSchema>
export type EnrichedTokenBalanceResponse = z.infer<typeof EnrichedTokenBalanceResponseSchema>