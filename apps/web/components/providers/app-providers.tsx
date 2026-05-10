'use client'

import { ReactNode, useState } from 'react'
import { ThemeProvider } from './theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import { NextIntlClientProvider } from 'next-intl'

export function AppProviders({
  children,
  locale,
  messages
}: {
  children: ReactNode
  locale: string
  messages: Record<string, any>
}) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <NextTopLoader color="#10b981" showSpinner={false}></NextTopLoader>
        <ThemeProvider>{children}</ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}
