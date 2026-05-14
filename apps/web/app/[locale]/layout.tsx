import '../styles.css'
import { AppProviders } from '@/components/providers/app-providers'
import { Metadata } from 'next'
import { getMessages, getTimeZone, setRequestLocale } from 'next-intl/server'
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
  const timeZone = await getTimeZone()

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className="antialiased">
      <body>
        <AppProviders locale={locale} timeZone={timeZone} messages={messages}>
          {children}
        </AppProviders>
        <Toaster richColors />
      </body>
    </html>
  )
}
