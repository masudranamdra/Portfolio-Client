import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const protectedPaths = ['/dashboard', '/gallery/images', '/gallery/videos'];
const adminPaths = ['/admin'];

// Middleware runs at runtime, not build time, so this is safe
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = !!getSessionCookie(request);

  if ([...protectedPaths, ...adminPaths].some((path) => pathname.startsWith(path)) && !hasSession) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/gallery/images/:path*', '/gallery/videos/:path*'],
};
