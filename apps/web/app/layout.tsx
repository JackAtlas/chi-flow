import './styles.css'
import { AppProviders } from '@/components/providers/app-providers'
import { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'ChiFlow',
  description: '一款工作流管理工具'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body>
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
