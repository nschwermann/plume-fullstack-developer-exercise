import { NextRequest, NextResponse } from 'next/server'
import { TokenBalanceService } from '@/services/token-balance'
import { z } from 'zod'

const AddressParamsSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const resolvedParams = await params
    const validatedParams = AddressParamsSchema.parse(resolvedParams)
    
    const tokenBalanceService = new TokenBalanceService()
    const balanceResponse = await tokenBalanceService.getTokenBalances(validatedParams.address)
    
    const headers: Record<string, string> = {
      'Cache-Control': 'max-age=60'
    }
    
    if (balanceResponse.cached) {
      headers['X-Cache'] = balanceResponse.stale ? 'STALE' : 'HIT'
      const age = tokenBalanceService.getCacheAge(validatedParams.address)
      if (age !== null) {
        headers['Age'] = Math.floor(age / 1000).toString()
      }
    } else {
      headers['X-Cache'] = 'MISS'
      headers['Age'] = '0'
    }
    
    return NextResponse.json(balanceResponse.data, { headers })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid address format', details: error.errors },
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