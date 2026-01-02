import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/client"
import { reportError } from "@/lib/global-error-handler"
import { authMiddleware, verifyToken, extractToken } from "@/lib/api/auth-middleware"
import { validateRequest, sanitizeString, validateDate } from "@/lib/api/validation"
import { csrfProtection } from "@/lib/api/csrf-protection"
import { rateLimiter, setRateLimitHeaders, defaultRateLimitConfig, getClientIdentifier } from "@/lib/api/rate-limiter"
import { z } from "zod"

const childSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeString),
  gender: z.enum(['male', 'female', 'other']),
  birth_date: z.string().refine(validateDate, { message: 'Invalid birth date' }),
  parent_id: z.string().uuid(),
  avatar_url: z.string().url().optional(),
  medical_notes: z.string().max(1000).optional().default('').transform(sanitizeString),
  allergies: z.array(z.string()).optional(),
  emergency_contact: z.object({
    name: z.string().min(1).max(100).transform(sanitizeString),
    phone: z.string().min(10).max(20),
    relationship: z.string().min(1).max(50).transform(sanitizeString),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const rateLimitError = await rateLimiter(defaultRateLimitConfig)(request)
    if (rateLimitError) return rateLimitError

    const authError = await authMiddleware(request)
    if (authError) return authError

    const token = extractToken(request)
    const payload = verifyToken(token!)

    await db.seedMockData()

    const children = await db.findMany("children", (item: any) => item.parent_id === payload.userId)
    const response = NextResponse.json({ data: children, success: true })
    return setRateLimitHeaders(response, defaultRateLimitConfig, getClientIdentifier(request))
  } catch (error) {
    reportError(error as Error, { component: 'ChildrenAPI', action: 'fetchChildren', endpoint: '/api/children' })
    return NextResponse.json({ error: "Failed to fetch children", success: false }, { status: 500 })
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
    const validation = validateRequest(childSchema, body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error, success: false }, { status: 400 })
    }

    const newChild = await db.create("children", {
      ...validation.data,
      parent_id: payload.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    const response = NextResponse.json({ data: newChild, success: true }, { status: 201 })
    return setRateLimitHeaders(response, defaultRateLimitConfig, getClientIdentifier(request))
  } catch (error) {
    reportError(error as Error, { component: 'ChildrenAPI', action: 'createChild', endpoint: '/api/children' })
    return NextResponse.json({ error: "Failed to create child", success: false }, { status: 500 })
  }
}
