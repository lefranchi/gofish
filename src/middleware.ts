import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/api/fisheries', '/api/searches'];
  
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Verificar se há token de autenticação
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      // Redirecionar para login se não autenticado
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
