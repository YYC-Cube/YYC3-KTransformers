import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export function rateLimiter(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const clientId = getClientIdentifier(request);
    const now = Date.now();
    
    let record = rateLimitStore.get(clientId);
    
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(clientId, record);
    }
    
    record.count++;
    
    const remainingRequests = Math.max(0, config.maxRequests - record.count);
    const resetTime = Math.ceil(record.resetTime / 1000);
    
    if (record.count > config.maxRequests) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        { status: 429 }
      );
      
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', resetTime.toString());
      response.headers.set('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString());
      
      return response;
    }
    
    return null;
  };
}

export function setRateLimitHeaders(response: NextResponse, config: RateLimitConfig, clientId: string): NextResponse {
  const record = rateLimitStore.get(clientId);
  
  if (record) {
    const remainingRequests = Math.max(0, config.maxRequests - record.count);
    const resetTime = Math.ceil(record.resetTime / 1000);
    
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remainingRequests.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());
  }
  
  return response;
}

export function cleanupRateLimitStore(): void {
  const now = Date.now();
  
  for (const [clientId, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(clientId);
    }
  }
}

setInterval(cleanupRateLimitStore, 60000);

export const defaultRateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
};

export const strictRateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
};

export const authRateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
};
