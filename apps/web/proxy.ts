import { NextRequest, NextResponse } from 'next/server'
import { auth } from './lib/auth/auth'
import { headers } from 'next/headers'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const isLoggedIn = !!session?.user
  const { pathname } = request.nextUrl

  const authPages = ['/signUp', '/signIn', '/adminSignIn']

  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
