import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { reportError } from "@/lib/global-error-handler"
import { authMiddleware, verifyToken, extractToken } from "@/lib/api/auth-middleware"
import { validateRequest, sanitizeString, validateDate } from "@/lib/api/validation"
import { csrfProtection } from "@/lib/api/csrf-protection"
import { rateLimiter, defaultRateLimitConfig, setRateLimitHeaders, getClientIdentifier } from "@/lib/api/rate-limiter"
import { z } from "zod"

const growthRecordSchema = z.object({
  child_id: z.string().uuid(),
  type: z.enum(['height', 'weight', 'milestone', 'health', 'behavior', 'learning']),
  value: z.union([z.number(), z.string().max(500)]),
  unit: z.string().max(20).optional(),
  recorded_at: z.string().refine(validateDate, { message: 'Invalid recorded date' }),
  notes: z.string().max(1000).optional().default('').transform(sanitizeString),
  attachments: z.array(z.object({
    url: z.string().url(),
    type: z.string(),
    name: z.string().min(1).max(255),
  })).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authError = await authMiddleware(request)
    if (authError) return authError

    await db.seedMockData()

    const searchParams = request.nextUrl.searchParams
    const childId = searchParams.get("childId")
    const type = searchParams.get("type")

    let records = await db.findMany("growth_records")

    if (childId) {
      records = records.filter((record: any) => record.child_id === childId)
    }

    if (type) {
      records = records.filter((record: any) => record.type === type)
    }

    records.sort((a: any, b: any) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())

    return NextResponse.json({ data: records, success: true })
  } catch (error) {
    reportError(error as Error, { component: 'GrowthRecordsAPI', action: 'fetchGrowthRecords', endpoint: '/api/growth-records' })
    return NextResponse.json({ error: "Failed to fetch growth records", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitError = await rateLimiter(defaultRateLimitConfig)(request)
    if (rateLimitError) return rateLimitError

    const csrfError = csrfProtection(request)
    if (csrfError) return csrfError

    const authError = await authMiddleware(request)
    if (authError) return authError

    const token = extractToken(request)
    const payload = verifyToken(token!)

    const body = await request.json()
    const validation = validateRequest(growthRecordSchema, body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, success: false }, { status: 400 })
    }

    const newRecord = await db.create("growth_records", {
      ...validation.data,
      recorded_by: payload.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    const response = NextResponse.json({ data: newRecord, success: true }, { status: 201 })
    return setRateLimitHeaders(response, defaultRateLimitConfig, getClientIdentifier(request))
  } catch (error) {
    reportError(error as Error, { component: 'GrowthRecordsAPI', action: 'createGrowthRecord', endpoint: '/api/growth-records' })
    return NextResponse.json({ error: "Failed to create growth record", success: false }, { status: 500 })
  }
}
