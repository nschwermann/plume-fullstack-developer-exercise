/**
 * Formats a hex address to show first 5 and last 4 characters
 * @param hex - The hex string to format (e.g., wallet address)
 * @returns Formatted string like "0xac3...3913"
 */
export function formatHex(hex: string): string {
  if (!hex || hex.length < 10) {
    return hex;
  }
  
  return `${hex.slice(0, 5)}...${hex.slice(-4)}`;
}