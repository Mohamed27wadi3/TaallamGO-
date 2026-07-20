const LOCAL_PLACEHOLDER_DATABASES = [
  'postgresql://user:password@localhost',
  'postgres://user:password@localhost',
]

export function getEffectiveDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL
  const isMissingOrLocal =
    !databaseUrl ||
    LOCAL_PLACEHOLDER_DATABASES.some(value => databaseUrl.startsWith(value))

  if (isMissingOrLocal) {
    return process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL || databaseUrl
  }

  return databaseUrl
}

export function getDatabaseConfigurationError() {
  const databaseUrl = getEffectiveDatabaseUrl()

  if (!databaseUrl) {
    return 'Aucune URL PostgreSQL disponible. Ajoute DATABASE_URL, PRISMA_DATABASE_URL ou POSTGRES_URL dans Vercel.'
  }

  if (LOCAL_PLACEHOLDER_DATABASES.some(value => databaseUrl.startsWith(value))) {
    return 'La base de données utilise encore localhost. Sur Vercel, configure une vraie URL PostgreSQL dans DATABASE_URL, PRISMA_DATABASE_URL ou POSTGRES_URL.'
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

export function isDatabaseSchemaMissingError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: unknown; message?: unknown }
  return (
    maybeError.code === 'P2021' ||
    maybeError.code === 'P2022' ||
    (typeof maybeError.message === 'string' &&
      (maybeError.message.includes('does not exist') ||
        maybeError.message.includes('relation') ||
        maybeError.message.includes('table')))
  )
}

export async function checkDatabaseReady() {
  const configurationError = getDatabaseConfigurationError()
  if (configurationError) {
    return { ok: false, error: configurationError }
  }

  try {
    const { db } = await import('./db')
    await db.user.findFirst({ select: { id: true }, take: 1 })
    return { ok: true, error: null }
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return {
        ok: false,
        error: 'Impossible de joindre la base de données. Vérifie DATABASE_URL et que PostgreSQL est actif.',
      }
    }

    if (isDatabaseSchemaMissingError(error)) {
      return {
        ok: false,
        error: 'La base est connectée, mais les tables Prisma ne sont pas créées. Lance prisma migrate deploy puis redéploie.',
      }
    }

    return {
      ok: false,
      error: 'La base de données est indisponible pour le moment.',
    }
  }
}
