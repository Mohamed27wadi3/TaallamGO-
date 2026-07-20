import { PrismaClient } from '@prisma/client'
import { getEffectiveDatabaseUrl } from './database-health'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const effectiveDatabaseUrl = getEffectiveDatabaseUrl()

if (effectiveDatabaseUrl) {
  process.env.DATABASE_URL = effectiveDatabaseUrl
}

export const db = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db
