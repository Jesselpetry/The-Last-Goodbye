import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect /admin routes
  if (path.startsWith('/admin')) {
    const isAdmin = request.cookies.get('admin_session')?.value === 'authenticated';

    // If trying to access login page while logged in, redirect to dashboard
    if (path === '/admin/login') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // If trying to access protected admin routes while not logged in
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}
