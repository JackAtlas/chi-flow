'use client'

import { ReactNode, useState } from 'react'
import { ThemeProvider } from '../theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
