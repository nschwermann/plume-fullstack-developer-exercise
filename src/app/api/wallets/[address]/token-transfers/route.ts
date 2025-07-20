import { NextRequest, NextResponse } from 'next/server'
import { TokenTransfersService } from '@/services/token-transfers'
import { z } from 'zod'

const AddressParamsSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
})

const QueryParamsSchema = z.object({
  block_number: z.string().nullable().optional(),
  index: z.string().nullable().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const resolvedParams = await params
    const validatedParams = AddressParamsSchema.parse(resolvedParams)
    
    const { searchParams } = new URL(request.url)
    const queryParams = {
      block_number: searchParams.get('block_number'),
      index: searchParams.get('index')
    }
    
    const validatedQuery = QueryParamsSchema.parse(queryParams)
    
    let nextPageParams: { block_number: number; index: number } | undefined
    if (validatedQuery.block_number && validatedQuery.index) {
      nextPageParams = {
        block_number: parseInt(validatedQuery.block_number),
        index: parseInt(validatedQuery.index)
      }
    }
    
    const tokenTransfersService = new TokenTransfersService()
    const transferResponse = await tokenTransfersService.getTokenTransfers(
      validatedParams.address,
      nextPageParams
    )
    
    const headers: Record<string, string> = {
      'Cache-Control': 'max-age=30'
    }
    
    if (transferResponse.cached) {
      headers['X-Cache'] = transferResponse.stale ? 'STALE' : 'HIT'
      const age = tokenTransfersService.getCacheAge(validatedParams.address, nextPageParams)
      if (age !== null) {
        headers['Age'] = Math.floor(age / 1000).toString()
      }
    } else {
      headers['X-Cache'] = 'MISS'
      headers['Age'] = '0'
    }
    
    return NextResponse.json(transferResponse.data, { headers })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}