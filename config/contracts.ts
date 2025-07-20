import type { Address } from 'viem'

export const CONTRACT_ADDRESSES = {
  98866: { // Plume Mainnet
    TipJar: '0x8590C09297B798BE270bc0E4e2C9cEf052F8919A' as Address,
  }
} as const

export function getTipJarAddress(chainId: number): Address {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  if (!addresses) {
    throw new Error(`TipJar contract not deployed on chain ${chainId}`)
  }
  return addresses.TipJar
}