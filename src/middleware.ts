// app/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  if (hostname.startsWith('localhost')) {
    return NextResponse.rewrite(new URL('/', request.url))
  } else if (hostname.startsWith('app.localhost')) {
    return NextResponse.rewrite(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
