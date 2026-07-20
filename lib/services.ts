import Decimal from 'decimal.js'

// ==================== PRICING SERVICE ====================

interface PricingInput {
  priceUsd: number
  exchangeRate: number
  exchangeMargin: number
  feePercentage: number
  commissionPercentage: number
  discountPercentage?: number
}

interface PricingResult {
  priceUsd: number
  exchangeRate: number
  priceBeforeFees: number
  paymentFee: number
  commission: number
  discount?: number
  totalDzd: number
  breakdown: {
    label: string
    amount: number
  }[]
}

/**
 * Calculate total price without floating point errors
 * All amounts in smallest currency unit (dinars for DZD)
 */
export function calculatePrice(input: PricingInput): PricingResult {
  const {
    priceUsd,
    exchangeRate,
    exchangeMargin,
    feePercentage,
    commissionPercentage,
    discountPercentage = 0,
  } = input

  // Use Decimal.js for precise calculations
  const priceUsdDecimal = new Decimal(priceUsd)
  const rateDecimal = new Decimal(exchangeRate)
  const marginDecimal = new Decimal(exchangeMargin)
  const feeDecimal = new Decimal(feePercentage)
  const commissionDecimal = new Decimal(commissionPercentage)
  const discountDecimal = new Decimal(discountPercentage)

  // Step 1: Convert USD to DZD with exchange rate
  let convertedDzd = priceUsdDecimal.times(rateDecimal).times(new Decimal(1).plus(marginDecimal))

  // Round to nearest dinar
  convertedDzd = convertedDzd.toDecimalPlaces(0, Decimal.ROUND_HALF_UP)

  // Step 2: Calculate fees on converted amount
  const paymentFeeDecimal = convertedDzd.times(feeDecimal)
  const paymentFee = paymentFeeDecimal.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber()

  // Step 3: Calculate commission on converted amount + fee
  const subtotal = convertedDzd.plus(new Decimal(paymentFee))
  const commissionDecimalAmount = subtotal.times(commissionDecimal)
  const commission = commissionDecimalAmount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber()

  // Step 4: Apply discount if provided
  let discount = 0
  let total = convertedDzd.plus(new Decimal(paymentFee)).plus(new Decimal(commission))

  if (discountPercentage > 0) {
    const discountAmount = total.times(discountDecimal)
    discount = discountAmount.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber()
    total = total.minus(new Decimal(discount))
  }

  const totalDzd = total.toNumber()

  return {
    priceUsd,
    exchangeRate,
    priceBeforeFees: convertedDzd.toNumber(),
    paymentFee,
    commission,
    discount: discount || undefined,
    totalDzd,
    breakdown: [
      { label: 'Prix source (USD)', amount: priceUsd },
      { label: 'Prix converti (DZD)', amount: convertedDzd.toNumber() },
      { label: 'Frais de paiement', amount: paymentFee },
      { label: 'Commission TaallamGo', amount: commission },
      ...(discount > 0 ? [{ label: 'Remise appliquée', amount: -discount }] : []),
      { label: 'Total final (DZD)', amount: totalDzd },
    ],
  }
}

/**
 * Validate price calculation for consistency
 */
export function validatePricingCalculation(result: PricingResult): boolean {
  const expectedTotal = new Decimal(result.priceBeforeFees)
    .plus(new Decimal(result.paymentFee))
    .plus(new Decimal(result.commission))
    .minus(new Decimal(result.discount || 0))

  return expectedTotal.equals(new Decimal(result.totalDzd))
}

// ==================== ORDER STATE MACHINE ====================

type OrderStatus =
  | 'awaiting_payment'
  | 'payment_review'
  | 'paid'
  | 'processing'
  | 'customer_action_required'
  | 'delivered'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded'
  | 'disputed'

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  'awaiting_payment': ['payment_review', 'cancelled'],
  'payment_review': ['paid', 'awaiting_payment', 'cancelled'],
  'paid': ['processing', 'refund_pending', 'cancelled'],
  'processing': ['customer_action_required', 'delivered', 'cancelled'],
  'customer_action_required': ['processing', 'delivered', 'cancelled'],
  'delivered': ['refund_pending', 'disputed'],
  'cancelled': ['refund_pending'],
  'refund_pending': ['refunded', 'disputed'],
  'refunded': [],
  'disputed': ['refunded', 'processing'],
}

export function isValidStatusTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
): boolean {
  return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false
}

export function getValidNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  return VALID_TRANSITIONS[currentStatus] || []
}

// ==================== PAYMENT SERVICE ====================

export interface PaymentProviderInterface {
  createPaymentIntent(orderId: string, amountDzd: number): Promise<{ id: string; clientSecret?: string }>
  confirmPayment(paymentId: string, referenceExternal: string): Promise<boolean>
  refundPayment(paymentId: string, amountDzd: number): Promise<boolean>
  verifyWebhook(signature: string, payload: string): Promise<boolean>
}

export class MockPaymentProvider implements PaymentProviderInterface {
  async createPaymentIntent(orderId: string, amountDzd: number): Promise<{ id: string }> {
    // In production, this would call a real payment processor
    return {
      id: `mock_${orderId}_${Date.now()}`,
    }
  }

  async confirmPayment(paymentId: string, referenceExternal: string): Promise<boolean> {
    // Mock: always succeeds after delay
    return new Promise(resolve => {
      const delay = parseInt(process.env.MOCK_PAYMENT_DELAY_MS || '2000')
      setTimeout(() => resolve(true), delay)
    })
  }

  async refundPayment(paymentId: string, amountDzd: number): Promise<boolean> {
    // Mock: always succeeds
    return true
  }

  async verifyWebhook(signature: string, payload: string): Promise<boolean> {
    // Mock: simple verification
    return signature.length > 0 && payload.length > 0
  }
}

// ==================== EMAIL SERVICE ====================

export interface EmailProviderInterface {
  sendEmail(to: string, template: string, variables: Record<string, unknown>): Promise<void>
}

export class MockEmailProvider implements EmailProviderInterface {
  async sendEmail(to: string, template: string, variables: Record<string, unknown>): Promise<void> {
    console.log(`[MOCK EMAIL] To: ${to}, Template: ${template}`, variables)
  }
}

// ==================== VALIDATION HELPERS ====================

/**
 * Validate URL for SSRF protection
 */
export function validateUrlForSSRF(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url)

    // Block private/local IP ranges
    const hostname = parsed.hostname
    const privatePatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./,
      /^::1$/,
      /^fc00:/,
    ]

    for (const pattern of privatePatterns) {
      if (pattern.test(hostname)) {
        return { valid: false, error: 'Private or local IP address not allowed' }
      }
    }

    // Allow only HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP/HTTPS URLs are allowed' }
    }

    // Block file:// protocol
    if (parsed.protocol === 'file:') {
      return { valid: false, error: 'File protocol not allowed' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Safe file upload validation
 */
export function validateFileUpload(
  fileName: string,
  fileSize: number,
  fileType: string,
): { valid: boolean; error?: string } {
  const maxSizeMb = parseInt(process.env.MAX_FILE_SIZE_MB || '10')
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png').split(',')

  if (fileSize > maxSizeMb * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${maxSizeMb}MB limit` }
  }

  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (!allowedTypes.includes(ext)) {
    return { valid: false, error: `File type .${ext} not allowed` }
  }

  return { valid: true }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map()

  check(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (entry.count < limit) {
      entry.count++
      return true
    }

    return false
  }
}
