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
    const enrichedBalances = await tokenBalanceService.getTokenBalances(validatedParams.address)
    
    return NextResponse.json(enrichedBalances)
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