import { NextRequest, NextResponse } from 'next/server'
import createNextIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { auth } from './lib/auth/auth'

const intlMiddleware = createNextIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // next-intl middleware
  const response = intlMiddleware(request)

  // public routes
  const publicPages = ['/api/workflows']
  const isPublicPage = publicPages.some((page) => pathname.startsWith(page))
  if (isPublicPage) return response

  // auth pages
  const authPages = ['/signIn', '/signUp', '/adminSignIn']
  const isAuthPage = authPages.includes(pathname)

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
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
