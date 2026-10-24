import NextAuth from 'next-auth';

import {
  DEFAULT_LOGIN_REDIRECT,
  adminAuthPrefix,
  apiPrefix,
  authRoutes,
  privateAuthPrefix,
} from '@/routes';

import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);
  const isAdminRoute = nextUrl.pathname.startsWith(adminAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPrivateRoute = privateAuthPrefix.includes(nextUrl.pathname);

  if (isApiRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + (nextUrl.search || ''));
      return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
    }

    if (userRole !== 'ADMIN') {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return;
  }

  if (isPrivateRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + (nextUrl.search || ''));
      return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + (nextUrl.search || ''));
    return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and authentication routes
    '/(api|trpc|login|admin|private)(.*)',
  ],
};
