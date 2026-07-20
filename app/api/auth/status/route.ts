import { NextResponse } from 'next/server'
import { checkDatabaseReady } from '@/lib/database-health'

export async function GET() {
  const database = await checkDatabaseReady()

  return NextResponse.json(
    {
      success: database.ok,
      database,
    },
    { status: database.ok ? 200 : 503 },
  )
}
