import { NextRequest, NextResponse } from 'next/server';

// This middleware can be used for authentication or other request processing
export function middleware(request: NextRequest) {
  return NextResponse.next();
} 