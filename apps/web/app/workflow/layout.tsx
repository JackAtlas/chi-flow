import Logo from '@/components/logo'
import { ModeToggle } from '@/components/theme-mode-switcher'
import { Separator } from '@workspace/ui/components/separator'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo icon-size={16} font-size="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  )
}
