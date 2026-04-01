import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    console.log(`[MIDDLEWARE] Checking path: ${pathname}`);
    console.log(`[MIDDLEWARE] Token exists: ${!!token}, Role: ${token?.role}`);

    // Admin routes - require admin role
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      console.log(`[MIDDLEWARE] Rejecting admin access. Has Token: ${!!token}`);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Patient routes - require any authenticated user
    if (
      (pathname.startsWith('/book') ||
       pathname.startsWith('/my-appointments') ||
       pathname.startsWith('/profile')) &&
      !token
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/book/:path*',
    '/my-appointments/:path*',
    '/profile/:path*',
  ],
};
