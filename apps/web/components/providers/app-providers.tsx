'use client'

import { ReactNode, useState } from 'react'
import { ThemeProvider } from '../theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false}></NextTopLoader>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
