import { z } from 'zod'

// ==================== AUTH VALIDATORS ====================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ==================== PRODUCT VALIDATORS ====================

export const productFiltersSchema = z.object({
  platformId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  level: z.string().optional(),
  certificate: z.boolean().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'popular', 'newest']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

// ==================== CUSTOM REQUEST VALIDATORS ====================

export const customRequestSchema = z.object({
  url: z.string().url('Invalid URL').min(10),
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
})

// ==================== PRICING VALIDATORS ====================

export const pricingCalculateSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().positive().optional().default(1),
  couponCode: z.string().optional(),
})

// ==================== ORDER VALIDATORS ====================

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    variantId: z.string().cuid().optional(),
    quantity: z.number().int().positive().default(1),
  })).min(1),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
})

export const orderItemSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  quantity: z.number().int().positive(),
})

// ==================== PAYMENT VALIDATORS ====================

export const paymentIntentSchema = z.object({
  orderId: z.string().cuid(),
  amount: z.number().int().positive(),
})

export const paymentConfirmationSchema = z.object({
  orderId: z.string().cuid(),
  referenceExternal: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

// ==================== REFUND VALIDATORS ====================

export const refundRequestSchema = z.object({
  orderId: z.string().cuid(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  justification: z.string().optional(),
})

// ==================== SUPPORT TICKET VALIDATORS ====================

export const supportTicketSchema = z.object({
  orderId: z.string().cuid().optional(),
  category: z.enum(['technical', 'payment', 'delivery', 'account', 'other']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
})

export const ticketMessageSchema = z.object({
  content: z.string().min(1),
})

// ==================== ADMIN VALIDATORS ====================

export const productCreateSchema = z.object({
  platformId: z.string().cuid(),
  categoryId: z.string().cuid(),
  slug: z.string().min(3),
  title: z.string().min(3),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  type: z.enum(['course', 'subscription', 'certification', 'voucher']),
  level: z.string().optional(),
  duration: z.string().optional(),
  instructor: z.string().optional(),
  imageUrl: z.string().url().optional(),
  officialUrl: z.string().url(),
  certificate: z.boolean().optional(),
  language: z.string().optional(),
})

export const priceUpdateSchema = z.object({
  productId: z.string().cuid(),
  amountUsd: z.number().int().positive(),
  amountDzd: z.number().int().positive(),
  exchangeRate: z.number().positive(),
  exchangeMargin: z.number().min(0).max(1),
  feePercentage: z.number().min(0).max(1),
  commissionPercentage: z.number().min(0).max(1),
  source: z.string().optional(),
})

export const couponCreateSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(['fixed', 'percentage']),
  value: z.number().positive(),
  maxRedemptions: z.number().int().positive().optional(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
})

// Type exports for use in handlers
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProductFilters = z.infer<typeof productFiltersSchema>
export type CustomRequestInput = z.infer<typeof customRequestSchema>
export type PricingCalculateInput = z.infer<typeof pricingCalculateSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type PaymentIntentInput = z.infer<typeof paymentIntentSchema>
export type RefundRequestInput = z.infer<typeof refundRequestSchema>
export type SupportTicketInput = z.infer<typeof supportTicketSchema>
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>
export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type PriceUpdateInput = z.infer<typeof priceUpdateSchema>
export type CouponCreateInput = z.infer<typeof couponCreateSchema>
