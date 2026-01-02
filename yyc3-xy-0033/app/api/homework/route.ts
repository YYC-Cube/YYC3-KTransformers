import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { reportError } from "@/lib/global-error-handler"
import { authMiddleware, verifyToken, extractToken } from "@/lib/api/auth-middleware"
import { validateRequest, sanitizeString } from "@/lib/api/validation"
import { csrfProtection } from "@/lib/api/csrf-protection"
import { rateLimiter, defaultRateLimitConfig, setRateLimitHeaders, getClientIdentifier } from "@/lib/api/rate-limiter"
import { z } from "zod"

const homeworkSchema = z.object({
  child_id: z.string().uuid(),
  title: z.string().min(1).max(200).transform(sanitizeString),
  description: z.string().max(1000).optional().default('').transform(sanitizeString),
  subject: z.string().min(1).max(50).transform(sanitizeString),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid due date' }),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).default('pending'),
  estimated_time: z.number().min(1).max(480).optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string().min(1).max(255),
    size: z.number().min(0),
  })).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authError = await authMiddleware(request)
    if (authError) return authError

    await db.seedMockData()

    const searchParams = request.nextUrl.searchParams
    const childId = searchParams.get("childId")
    const status = searchParams.get("status")

    let homework = await db.findMany("homework_tasks")

    if (childId) {
      homework = homework.filter((hw: any) => hw.child_id === childId)
    }

    if (status) {
      homework = homework.filter((hw: any) => hw.status === status)
    }

    return NextResponse.json({ data: homework, success: true })
  } catch (error) {
    reportError(error as Error, { component: 'HomeworkAPI', action: 'fetchHomework', endpoint: '/api/homework' })
    return NextResponse.json({ error: "Failed to fetch homework", success: false }, { status: 500 })
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
    const validation = validateRequest(homeworkSchema, body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, success: false }, { status: 400 })
    }

    const newHomework = await db.create("homework_tasks", {
      ...validation.data,
      created_by: payload.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    const response = NextResponse.json({ data: newHomework, success: true }, { status: 201 })
    return setRateLimitHeaders(response, defaultRateLimitConfig, getClientIdentifier(request))
  } catch (error) {
    reportError(error as Error, { component: 'HomeworkAPI', action: 'createHomework', endpoint: '/api/homework' })
    return NextResponse.json({ error: "Failed to create homework", success: false }, { status: 500 })
  }
}
