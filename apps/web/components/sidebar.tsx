'use client'

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon
} from 'lucide-react'
import Logo from './logo'
import { Button, buttonVariants } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@workspace/ui/components/sheet'
import { cn } from '@workspace/ui/lib/utils'
import { useState } from 'react'
import UserAvailableBadge from './user-available-badge'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const routes = [
  {
    href: '/',
    label: 'home',
    icon: HomeIcon
  },
  {
    href: '/workflows',
    label: 'workflows',
    icon: Layers2Icon
  },
  {
    href: '/credentials',
    label: 'credentials',
    icon: ShieldCheckIcon
  },
  {
    href: '/billing',
    label: 'billing',
    icon: CoinsIcon
  }
] as const

function getActiveRoute(pathname: string) {
  if (pathname === '/') return routes[0]

  return (
    routes.find(
      (route) => route.href !== '/' && pathname.startsWith(route.href)
    ) || routes[0]
  )
}

export default function DesktopSidebar() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const activeRoute = getActiveRoute(pathname)
  return (
    <div className="relative hidden h-screen w-full max-w-70 border-separate overflow-hidden border-r-2 bg-primary/5 text-muted-foreground md:block dark:bg-secondary/30 dark:text-foreground">
      <div className="flex border-separate items-center justify-center gap-2 border-b p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableBadge />
      </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              buttonVariants(),
              'justify-start gap-2',
              activeRoute.href === route.href
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-transparent text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground'
            )}
          >
            <route.icon size={20} />
            {t(route.label)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [isOpen, setOpen] = useState(false)
  const pathname = usePathname()
  const activeRoute = getActiveRoute(pathname)
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-100 space-y-4 sm:w-135" side="left">
            <Logo />
            <UserAvailableBadge />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    buttonVariants(),
                    'justify-start gap-2',
                    activeRoute.href === route.href
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-transparent text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground'
                  )}
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
