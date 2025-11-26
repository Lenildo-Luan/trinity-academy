import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  console.log('[MIDDLEWARE] Processing request:', request.nextUrl.pathname);

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

  console.log('[MIDDLEWARE] Allowing request to proceed');
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
