import { I18NSwitcher } from '@/components/i18n-switcher'
import Logo from '@/components/logo'
import { ModeToggler } from '@/components/mode-toggler'
import { Separator } from '@workspace/ui/components/separator'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo icon-size={16} font-size="text-xl" />
        <div className="flex gap-2">
          <I18NSwitcher />
          <ModeToggler />
        </div>
      </footer>
    </div>
  )
}
