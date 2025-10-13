import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  console.log('[Middleware] Processing request:', request.nextUrl.pathname);
  console.log('[Middleware] ENV check:', {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  console.log('[Middleware] User:', user ? `${user.email} (${user.id})` : 'null');
  console.log('[Middleware] Error:', error?.message || 'none');

  // Protect routes - redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
                      request.nextUrl.pathname.startsWith("/otp");

  console.log('[Middleware] isAuthRoute:', isAuthRoute);

  if (!user && !isAuthRoute) {
    console.log('[Middleware] Redirecting to /login - no user');
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    console.log('[Middleware] Redirecting to / - user on auth page');
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  console.log('[Middleware] Allowing request to proceed');
  return supabaseResponse;
}
