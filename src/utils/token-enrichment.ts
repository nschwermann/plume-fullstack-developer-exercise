const TOKEN_ICON_MAP: Record<string, string> = {
  '0xe72fe64840f4ef80e3ec73a1c749491b5c938cb9': '/nTBILL-token.webp',
  '0x593ccca4c4bf58b7526a4c164ceef4003c6388db': '/nALPHA-token.webp', 
  '0xdddd73f5df1f0dc31373357beac77545dc5a6f3f': '/pUSD-token.webp'
}

//Instructions say we only want to view nTBILL and nALPHA on the front end
const TOKEN_WHITELIST = new Set([
  '0xe72fe64840f4ef80e3ec73a1c749491b5c938cb9', // nTBILL
  '0x593ccca4c4bf58b7526a4c164ceef4003c6388db', // nALPHA
  // '0xdddd73f5df1f0dc31373357beac77545dc5a6f3f'  // pUSD
])

const DEFAULT_TOKEN_ICON = '/default_token.webp'

export { TOKEN_WHITELIST }

export class TokenEnrichmentUtils {
  static getTokenIcon(tokenAddress: string): string {
    return TOKEN_ICON_MAP[tokenAddress] || DEFAULT_TOKEN_ICON
  }

  static formatTokenValue(value: string, decimals: string): string {
    const decimalPlaces = parseInt(decimals)
    const bigIntValue = BigInt(value)
    const divisor = BigInt(10 ** decimalPlaces)
    
    const wholePart = bigIntValue / divisor
    const fractionalPart = bigIntValue % divisor
    
    if (fractionalPart === 0n) {
      return wholePart.toString()
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimalPlaces, '0')
    const trimmedFractional = fractionalStr.replace(/0+$/, '')
    
    return `${wholePart}.${trimmedFractional}`
  }

  static calculateUsdValue(formattedValue: string, exchangeRate: string): string {
    const tokenValue = parseFloat(formattedValue)
    const rate = parseFloat(exchangeRate)
    const usdValue = tokenValue * rate
    
    return usdValue.toFixed(2)
  }
}