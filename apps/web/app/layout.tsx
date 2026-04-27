import "./styles.css"
import { AppProviders } from "@/components/providers/app-providers"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
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
