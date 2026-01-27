// lib/auth-middleware.js
import { NextResponse } from 'next/server';

export async function requireAuth(request) {
  try {
    // Get cookies from the request object
    const cookieHeader = request.headers.get('cookie') || '';
    const userId = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('userId='))
      ?.split('=')[1];

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    // Return userId only - routes will handle DB validation separately
    return { userId };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Rate limiting helper
const rateLimitMap = new Map();

export function rateLimit(identifier, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const key = identifier;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  const record = rateLimitMap.get(key);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return false;
  }
  
  if (record.count >= limit) {
    return true;
  }
  
  record.count++;
  return false;
}