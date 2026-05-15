import { NextRequest, NextResponse } from 'next/server'
import createNextIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { auth } from './lib/auth/auth'

const intlMiddleware = createNextIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  console.log({
    url: request.url,
    host: request.headers.get('host'),
    forwardedHost: request.headers.get('x-forwarded-host'),
    proto: request.headers.get('x-forwarded-proto')
  })
  const pathname = request.nextUrl.pathname

  // next-intl middleware
  const response = intlMiddleware(request)

  // public routes
  const publicPages = ['/api/workflows']
  const isPublicPage = publicPages.some((page) => pathname.startsWith(page))
  if (isPublicPage) return response

  // auth pages
  const authPages = ['/signIn', '/signUp', '/adminSignIn']
  const isAuthPage = authPages.some((page) => pathname.endsWith(page))

  // session
  const session = await auth.api.getSession({
    headers: request.headers
  })
  const isLoggedIn = !!session?.user

  // logged in user visits auth page
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // protected routes
  if (!isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
