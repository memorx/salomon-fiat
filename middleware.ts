// middleware.ts

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/', '/login', '/registro'];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Rutas de API públicas
  const isPublicApi = nextUrl.pathname.startsWith('/api/auth');

  // Si es ruta pública o API de auth, permitir
  if (isPublicRoute || isPublicApi) {
    // Si está logueado e intenta ir a login/registro, redirigir a dashboard
    if (
      isLoggedIn &&
      (nextUrl.pathname === '/login' || nextUrl.pathname === '/registro')
    ) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  // Si no está logueado y no es ruta pública, redirigir a login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
