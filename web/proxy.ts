import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const proxy = withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    if (token?.needTwoFactor && request.nextUrl.pathname !== '/2fa') {
      return NextResponse.redirect(new URL('/2fa', request.url));
    }
  },
  {
    pages: { signIn: '/sign-in' },
    callbacks: {
      authorized: ({ token }) =>
        !!token && (!!token.accessToken || !!token.needTwoFactor)
    }
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|forget-password|reset-password).*)'
  ]
};
