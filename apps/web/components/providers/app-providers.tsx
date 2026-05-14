'use client'

import { ReactNode, useState } from 'react'
import { ThemeProvider } from './theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import { NextIntlClientProvider, type Timezone } from 'next-intl'

export function AppProviders({
  children,
  locale,
  messages,
  timeZone
}: {
  children: ReactNode
  locale: string
  messages: Record<string, any>
  timeZone: Timezone
}) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        <NextTopLoader color="#10b981" showSpinner={false}></NextTopLoader>
        <ThemeProvider>{children}</ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}
