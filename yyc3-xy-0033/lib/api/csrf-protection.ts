import { NextRequest, NextResponse } from 'next/server';

const CSRF_SECRET = process.env.CSRF_SECRET || 'change-this-in-production';

export function generateCSRFToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const token = Buffer.from(`${timestamp}.${random}.${CSRF_SECRET}`).toString('base64');
  return token;
}

export function validateCSRFToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('.');
    
    if (parts.length !== 3) {
      return false;
    }
    
    const [timestamp, random, secret] = parts;
    const now = Date.now();
    const tokenAge = now - parseInt(timestamp);
    
    if (tokenAge > 3600000) {
      return false;
    }
    
    return secret === CSRF_SECRET;
  } catch {
    return false;
  }
}

export function setCSRFCookie(response: NextResponse): NextResponse {
  const token = generateCSRFToken();
  response.cookies.set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600,
    path: '/',
  });
  return response;
}

export function getCSRFToken(request: NextRequest): string | null {
  return request.cookies.get('csrf_token')?.value || null;
}

export function getCSRFTokenFromHeader(request: NextRequest): string | null {
  return request.headers.get('x-csrf-token') || null;
}

export function csrfProtection(request: NextRequest): NextResponse | null {
  const method = request.method;
  
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }
  
  const cookieToken = getCSRFToken(request);
  const headerToken = getCSRFTokenFromHeader(request);
  
  if (!cookieToken || !headerToken) {
    return NextResponse.json(
      { success: false, error: 'CSRF token missing' },
      { status: 403 }
    );
  }
  
  if (!validateCSRFToken(cookieToken) || !validateCSRFToken(headerToken)) {
    return NextResponse.json(
      { success: false, error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  return null;
}
