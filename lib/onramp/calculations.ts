import {
  convertAmount,
  calculateFeeBreakdown,
  calculateOnrampNetworkFee,
  calculateProcessingFee,
} from '@/lib/calculations'
import type { FiatCurrency } from '@/types/onramp'

export function calculateCryptoAmount(amount: number, rate: number) {
  return convertAmount(amount, rate)
}

export { calculateProcessingFee, calculateFeeBreakdown }

export function calculateNetworkFee(currency: FiatCurrency) {
  return calculateOnrampNetworkFee(currency)
}
