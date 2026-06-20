import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;

  // Skip static assets, api routes, icons, and next folders
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return response;
  }

  // Create supabase client for reading cookie sessions and redirects
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1) 301 Redirect Check
  // Check for both the requested pathname and pathname with trailing slash to ensure compatibility.
  const lookupPaths = [pathname];
  if (!pathname.endsWith('/')) {
    lookupPaths.push(pathname + '/');
  } else {
    lookupPaths.push(pathname.slice(0, -1));
  }

  const { data: redirectData } = await supabase
    .from('redirects')
    .select('to_path, status')
    .in('from_path', lookupPaths)
    .maybeSingle();

  if (redirectData) {
    const statusCode = redirectData.status || 301;
    return NextResponse.redirect(new URL(redirectData.to_path, request.url), statusCode);
  }

  // 2) Auth Check for Admin Portal
  if (pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser();

    // Allow user to go to login page
    if (pathname === '/admin/login') {
      if (user) {
        // If user is already authenticated, verify if they are an admin
        const { data: adminCheck } = await supabase
          .from('admins')
          .select('id')
          .or(`id.eq.${user.id},email.eq.${user.email}`)
          .maybeSingle();

        if (adminCheck) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
      return response;
    }

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify if user is an admin
    const { data: adminCheck } = await supabase
      .from('admins')
      .select('id')
      .or(`id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (!adminCheck) {
      // Sign out and redirect to login if authenticated user is not an admin
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
