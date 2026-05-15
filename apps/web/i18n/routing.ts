import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
  localeCookie: {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }
})
