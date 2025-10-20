import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Rotas públicas que não precisam de assinatura ativa
const PUBLIC_ROUTES = ['/login', '/otp', '/subscribe', '/subscription-expired'];

// Rotas de API que não precisam de verificação
const API_ROUTES = ['/api/stripe/webhooks'];

export async function middleware(request) {
  console.log('[MIDDLEWARE] Processing request:', request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  // Não verificar rotas de API específicas
  if (API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshing the auth token
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log('[MIDDLEWARE] User:', user ? `${user.email} (${user.id})` : 'null');
  console.log('[MIDDLEWARE] Error:', error?.message || 'none');

  // Protect routes - redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
                      request.nextUrl.pathname.startsWith("/otp");

  console.log('[MIDDLEWARE] isAuthRoute:', isAuthRoute);

  if (!user && !isAuthRoute) {
    console.log('[MIDDLEWARE] Redirecting to /login - no user');
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    console.log('[MIDDLEWARE] Redirecting to / - user on auth page');
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Verificar assinatura apenas para rotas protegidas
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  if (user && !isPublicRoute) {
    console.log('[MIDDLEWARE] Checking subscription status');

    const { data: accessStatus } = await supabase
      .from('user_access_status')
      .select('has_access')
      .eq('user_id', user.id)
      .single();

    console.log('[MIDDLEWARE] Access status:', accessStatus);

    if (!accessStatus?.has_access) {
      console.log('[MIDDLEWARE] Redirecting to /subscription-expired - no access');
      const url = request.nextUrl.clone();
      url.pathname = '/subscription-expired';
      return NextResponse.redirect(url);
    }
  }

  console.log('[MIDDLEWARE] Allowing request to proceed');
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
