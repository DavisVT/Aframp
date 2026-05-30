import {
  getOnrampLimits,
  validateAmount,
  isValidStellarAddress,
} from '@/lib/calculations'
import type { FiatCurrency } from '@/types/onramp'

export function getLimits(currency: FiatCurrency) {
  return getOnrampLimits(currency)
}

export { validateAmount, isValidStellarAddress }
