import { NextRequest, NextResponse } from 'next/server'
import createNextIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { auth } from './lib/auth/auth'

const intlMiddleware = createNextIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. next-intl 处理国际化路由（包括重定向）
  const response = intlMiddleware(request)

  // 如果 next-intl 已经返回了重定向，直接返回
  if (response.headers.get('location')) {
    return response
  }

  // 2. 公开 API 放行
  const publicApiPaths = ['/api/workflows']
  if (publicApiPaths.some((p) => pathname.startsWith(p))) {
    return response
  }

  // 3. 认证页面判断
  const authPages = ['/signIn', '/signUp', '/adminSignIn']
  const isAuthPage = authPages.some((page) => pathname.endsWith(page))

  // 4. 会话检查
  const session = await auth.api.getSession({ headers: request.headers })
  const isLoggedIn = !!session?.user

  // 5. 获取当前语言
  const locale =
    response.headers.get('x-next-intl-locale') || routing.defaultLocale

  // 6. 登录状态路由保护
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }
  if (!isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/signIn`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
