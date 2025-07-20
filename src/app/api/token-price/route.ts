import { NextResponse } from 'next/server'
import { TokenPriceService } from '@/services/token-price'
import { z } from 'zod'

export async function GET() {
  try {
    const tokenPriceService = new TokenPriceService()
    const priceData = await tokenPriceService.getTokenPrice()
    
    const headers: Record<string, string> = {
      'Cache-Control': 'max-age=300'
    }
    
    if (priceData.cached) {
      headers['X-Cache'] = priceData.stale ? 'STALE' : 'HIT'
      const age = tokenPriceService.getCacheAge()
      if (age !== null) {
        headers['Age'] = Math.floor(age / 1000).toString()
      }
    } else {
      headers['X-Cache'] = 'MISS'
      headers['Age'] = '0'
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { cached, stale, ...responseData } = priceData
    
    return NextResponse.json(responseData, { headers })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid response format from price provider', details: error.errors },
        { status: 502 }
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