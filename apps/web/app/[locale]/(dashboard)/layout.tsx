import { ReactNode } from 'react'
import { Separator } from '@workspace/ui/components/separator'
import DesktopSidebar from '@/components/sidebar'
import BreadcrumbHeader from '@/components/breadcrumb-header'
import { ModeToggler } from '@/components/mode-toggler'
import { UserDropdownMenu } from '@/components/user-dropdown-menu'
import { I18NSwitcher } from '@/components/i18n-switcher'

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-12.5 items-center justify-between px-6 py-4">
          <BreadcrumbHeader />
          <div className="flex items-center gap-2">
            <I18NSwitcher />
            <ModeToggler />
            <UserDropdownMenu />
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 py-4 text-accent-foreground">{children}</div>
        </div>
      </div>
    </div>
  )
}
