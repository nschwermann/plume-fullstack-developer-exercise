import { z } from 'zod'

export const CoinGeckoResponseSchema = z.object({
  plume: z.object({
    usd: z.number()
  })
})

export const TokenPriceResponseSchema = z.object({
  price: z.number()
})

export const TokenPriceServiceResponseSchema = z.object({
  price: z.number(),
  cached: z.boolean(),
  stale: z.boolean().optional()
})

export type CoinGeckoResponse = z.infer<typeof CoinGeckoResponseSchema>
export type TokenPriceResponse = z.infer<typeof TokenPriceResponseSchema>
export type TokenPriceServiceResponse = z.infer<typeof TokenPriceServiceResponseSchema>