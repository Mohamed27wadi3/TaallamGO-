import { db } from './db'

const LOCAL_PLACEHOLDER_DATABASES = [
  'postgresql://user:password@localhost',
  'postgres://user:password@localhost',
]

export function getDatabaseConfigurationError() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return 'La variable DATABASE_URL est absente. Ajoute une base PostgreSQL dans Vercel puis renseigne DATABASE_URL.'
  }

  if (LOCAL_PLACEHOLDER_DATABASES.some(value => databaseUrl.startsWith(value))) {
    return 'La base de données utilise encore localhost. Sur Vercel, configure une vraie URL PostgreSQL dans DATABASE_URL.'
  }

  return null
}

export function isDatabaseConnectionError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: unknown; message?: unknown }
  return (
    maybeError.code === 'P1001' ||
    (typeof maybeError.message === 'string' &&
      maybeError.message.includes("Can't reach database server"))
  )
}

export async function checkDatabaseReady() {
  const configurationError = getDatabaseConfigurationError()
  if (configurationError) {
    return { ok: false, error: configurationError }
  }

  try {
    await db.$queryRaw`SELECT 1`
    return { ok: true, error: null }
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return {
        ok: false,
        error: 'Impossible de joindre la base de données. Vérifie DATABASE_URL et que PostgreSQL est actif.',
      }
    }

    return {
      ok: false,
      error: 'La base de données est indisponible pour le moment.',
    }
  }
}
