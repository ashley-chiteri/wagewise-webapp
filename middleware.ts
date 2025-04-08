import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return req.cookies.get(name)?.value
        },
        set: (name: string, value: string, options: CookieOptions) => {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name: string, options: CookieOptions) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /register or /login
  // redirect the user to /register
  if (!session && !req.nextUrl.pathname.startsWith('/register') && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/register', req.url))
  }

  // If user is signed in and the current path is /register or /login
  // redirect the user to /dashboard
  if (session && (req.nextUrl.pathname.startsWith('/register') || req.nextUrl.pathname.startsWith('/login'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 