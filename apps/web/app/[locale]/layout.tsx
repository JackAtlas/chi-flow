import '../styles.css'
import { AppProviders } from '@/components/providers/app-providers'
import { Metadata } from 'next'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'ChiFlow',
  description: '一款工作流管理工具'
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className="antialiased">
      <body>
        <AppProviders locale={locale} messages={messages}>
          {children}
        </AppProviders>
        <Toaster richColors />
      </body>
    </html>
  )
}
