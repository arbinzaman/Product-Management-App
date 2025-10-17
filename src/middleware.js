import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value; // Read auth token from cookie
  const { pathname } = request.nextUrl;

  // Public routes — accessible without login
  const publicPaths = ['/login', '/register', '/favicon.ico', '/_next', '/api'];

  // Allow requests to public files and static assets
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If no token — redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise — allow access
  return NextResponse.next();
}

// Apply middleware to ALL routes except static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
