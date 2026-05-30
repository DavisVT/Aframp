import type { FiatCurrency, PaymentMethod } from '@/types/onramp'
import type { OfframpFeeBreakdown } from '@/types/offramp'
import { formatCurrency } from '@/lib/onramp/formatters'

export function convertAmount(amount: number, rate: number) {
  if (!amount || amount <= 0 || !rate || rate <= 0) return 0
  return amount * rate
}

export function calculatePercentageFee(amount: number, feeRate: number) {
  if (!amount || amount <= 0) return 0
  return amount * feeRate
}

const onrampNetworkFeeMap: Record<FiatCurrency, number> = {
  NGN: 0.15,
  KES: 0.5,
  GHS: 0.05,
  ZAR: 0.1,
  UGX: 10,
}

export function calculateProcessingFee(amount: number, method: PaymentMethod) {
  switch (method) {
    case 'card':
      return calculatePercentageFee(amount, 0.015)
    case 'mobile_money':
      return calculatePercentageFee(amount, 0.005)
    default:
      return 0
  }
}

export function calculateOnrampNetworkFee(currency: FiatCurrency) {
  return onrampNetworkFeeMap[currency]
}

export function calculateFeeBreakdown(
  amount: number,
  currency: FiatCurrency,
  method: PaymentMethod
) {
  const processingFee = calculateProcessingFee(amount, method)
  const networkFee = calculateOnrampNetworkFee(currency)
  const totalFees = processingFee + networkFee
  const totalCost = amount + totalFees

  return {
    processingFee,
    networkFee,
    totalFees,
    totalCost,
  }
}

const offrampNetworkFeeMap: Record<string, number> = {
  Stellar: 15,
  Ethereum: 1500,
  Polygon: 120,
  Base: 200,
}

export function calculateOfframpFees(
  fiatAmount: number,
  chain: string,
  offrampFeeRate = 0.01
): OfframpFeeBreakdown {
  const offrampFee = calculatePercentageFee(fiatAmount, offrampFeeRate)
  const networkFee = offrampNetworkFeeMap[chain] ?? 15
  const bankFee = 0
  const totalFees = offrampFee + networkFee + bankFee
  const receiveAmount = Math.max(fiatAmount - totalFees, 0)

  return {
    offrampFee,
    networkFee,
    bankFee,
    totalFees,
    receiveAmount,
  }
}

export const onrampLimitsMap: Record<FiatCurrency, { min: number; max: number }> = {
  NGN: { min: 1000, max: 500000 },
  KES: { min: 100, max: 50000 },
  GHS: { min: 10, max: 5000 },
  ZAR: { min: 20, max: 80000 },
  UGX: { min: 2000, max: 1000000 },
}

export const offrampLimitsMap: Record<FiatCurrency, { min: number; max: number }> = {
  NGN: { min: 5_000, max: 5_000_000 },
  KES: { min: 500, max: 500_000 },
  GHS: { min: 50, max: 50_000 },
  ZAR: { min: 100, max: 100_000 },
  UGX: { min: 20_000, max: 20_000_000 },
}

export function getOnrampLimits(currency: FiatCurrency) {
  return onrampLimitsMap[currency]
}

export function getOfframpLimits(currency: FiatCurrency) {
  return offrampLimitsMap[currency]
}

export function validateAmount(amount: number, currency: FiatCurrency) {
  const { min, max } = onrampLimitsMap[currency]
  if (!amount || amount <= 0) {
    return 'Enter an amount to continue.'
  }
  if (amount < min) {
    return `Minimum amount is ${formatCurrency(min, currency, 0)}.`
  }
  if (amount > max) {
    return `Maximum amount is ${formatCurrency(max, currency, 0)}.`
  }
  return ''
}

export function isValidStellarAddress(address: string) {
  if (!address) return false
  return /^G[A-Z2-7]{55}$/.test(address)
}
