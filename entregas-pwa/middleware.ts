import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const protectedRoutes = ['/entregas', '/painel', '/nova-entrega'];

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);

  if (!user && protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (request.nextUrl.pathname === '/login') {
      const nextPath = profile?.role === 'entregador' ? '/entregas' : '/painel';
      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    if (request.nextUrl.pathname.startsWith('/entregas') && profile?.role !== 'entregador') {
      return NextResponse.redirect(new URL('/painel', request.url));
    }

    if ((request.nextUrl.pathname.startsWith('/painel') || request.nextUrl.pathname.startsWith('/nova-entrega')) && profile?.role === 'entregador') {
      return NextResponse.redirect(new URL('/entregas', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons).*)']
};
