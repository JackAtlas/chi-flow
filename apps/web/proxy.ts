import { NextRequest, NextResponse } from 'next/server'
import createNextIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { auth } from './lib/auth/auth'

const intlMiddleware = createNextIntlMiddleware(routing)

// 获取请求对应的正确基础 URL（生产用域名，开发保留 localhost:端口）
function getRequestBase(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.host
  return `${proto}://${host}`
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. 先执行 next-intl 中间件（可能触发语言补全重定向）
  const response = intlMiddleware(request)

  // 2. 关键：如果存在 Location 头，强制将其转换为基于正确域名的绝对 URL
  const location = response.headers.get('location')
  if (location) {
    const base = getRequestBase(request)
    const redirectUrl = new URL(location, base)
    // 强制覆盖协议和主机（避免 relative URL 解析出 localhost:3002）
    redirectUrl.protocol = new URL(base).protocol
    redirectUrl.host = new URL(base).host

    return NextResponse.redirect(redirectUrl, {
      status: response.status as 301 | 302 | 303 | 307 | 308
    })
  }

  // 3. 公开 API 直接放行
  const publicApiPaths = ['/api/workflows']
  const isPublicApi = publicApiPaths.some((p) => pathname.startsWith(p))
  if (isPublicApi) return response

  // 4. 认证相关页面
  const authPages = ['/signIn', '/signUp', '/adminSignIn']
  const isAuthPage = authPages.some((page) => pathname.endsWith(page))

  // 5. 获取会话
  const session = await auth.api.getSession({ headers: request.headers })
  const isLoggedIn = !!session?.user

  // 6. 当前语言（优先取 next-intl 响应头中的 locale）
  const locale =
    response.headers.get('x-next-intl-locale') || routing.defaultLocale

  // 7. 已登录访问登录页 → 回首页
  if (isAuthPage && isLoggedIn) {
    const homeUrl = new URL(`/${locale}`, getRequestBase(request))
    return NextResponse.redirect(homeUrl)
  }

  // 8. 未登录访问保护页 → 去登录页
  if (!isAuthPage && !isLoggedIn) {
    const signInUrl = new URL(`/${locale}/signIn`, getRequestBase(request))
    return NextResponse.redirect(signInUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
