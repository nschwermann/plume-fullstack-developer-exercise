import { z } from 'zod'
import { TokenSchema, EnrichedTokenSchema } from './token-balance'

export const AddressSchema = z.object({
  ens_domain_name: z.string().nullable(),
  hash: z.string(),
  is_contract: z.boolean().default(false),
  name: z.string().nullable()
})

export const TotalSchema = z.object({
  decimals: z.string(),
  value: z.string()
})

export const TokenTransferItemSchema = z.object({
  block_hash: z.string(),
  block_number: z.number(),
  from: AddressSchema,
  log_index: z.number(),
  method: z.string().nullable(),
  timestamp: z.string(),
  to: AddressSchema,
  token: TokenSchema,
  total: TotalSchema,
  transaction_hash: z.string(),
  type: z.string()
})

export const NextPageParamsSchema = z.object({
  block_number: z.number(),
  index: z.number()
}).nullable()

export const TokenTransfersResponseSchema = z.object({
  items: z.array(TokenTransferItemSchema),
  next_page_params: NextPageParamsSchema
})

export const EnrichedAddressSchema = z.object({
  ens_domain_name: z.string().nullable(),
  address: z.string(),
  is_contract: z.boolean(),
  name: z.string().nullable()
})

export const EnrichedTokenTransferItemSchema = z.object({
  block_hash: z.string(),
  block_number: z.number(),
  from: EnrichedAddressSchema,
  timestamp: z.string(),
  to: EnrichedAddressSchema,
  token: EnrichedTokenSchema,
  total: TotalSchema,
  transaction_hash: z.string(),
  type: z.string(),
  formatted_amount: z.string(),
  usd_amount: z.string(),
  direction: z.enum(['in', 'out'])
})

export const EnrichedTokenTransfersResponseSchema = z.object({
  items: z.array(EnrichedTokenTransferItemSchema),
  next_page_params: NextPageParamsSchema
})

export type Address = z.infer<typeof AddressSchema>
export type Total = z.infer<typeof TotalSchema>
export type TokenTransferItem = z.infer<typeof TokenTransferItemSchema>
export type NextPageParams = z.infer<typeof NextPageParamsSchema>
export type TokenTransfersResponse = z.infer<typeof TokenTransfersResponseSchema>
export type EnrichedTokenTransferItem = z.infer<typeof EnrichedTokenTransferItemSchema>
export type EnrichedTokenTransfersResponse = z.infer<typeof EnrichedTokenTransfersResponseSchema>