import { NextRequest, NextResponse } from 'next/server'
import createNextIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { auth } from './lib/auth/auth'

const intlMiddleware = createNextIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // next-intl middleware
  const response = intlMiddleware(request)

  if (response.headers.get('location')) {
    return response
  }

  // public routes
  const publicApiPaths = ['/api/workflows']
  const isPublicPage = publicApiPaths.some((page) => pathname.startsWith(page))
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
    const locale =
      response.headers.get('x-next-intl-locale') || routing.defaultLocale
    const homeUrl = new URL(`/${locale}`, request.url)
    return NextResponse.redirect(homeUrl)
  }

  // protected routes
  if (!isAuthPage && !isLoggedIn) {
    const locale =
      response.headers.get('x-next-intl-locale') || routing.defaultLocale
    const signInUrl = new URL(`/${locale}/signIn`, request.url)
    return NextResponse.redirect(signInUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
