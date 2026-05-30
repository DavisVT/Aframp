import {
  convertAmount,
  calculateOfframpFees,
  getOfframpLimits,
} from '@/lib/calculations'
import type { FiatCurrency } from '@/types/onramp'

export function calculateFiatAmount(amount: number, rate: number) {
  return convertAmount(amount, rate)
}

export function calculateFees(
  fiatAmount: number,
  chain: string,
  offrampFeeRate?: number
) {
  return calculateOfframpFees(fiatAmount, chain, offrampFeeRate)
}

export function getMinMax(currency: FiatCurrency) {
  return getOfframpLimits(currency)
}
