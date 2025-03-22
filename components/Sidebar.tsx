'use client'

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon
} from 'lucide-react'
import React from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { Button, buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from './ui/sheet'
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge'

export const routes = [
  {
    href: '',
    label: '首页',
    icon: HomeIcon
  },
  {
    href: 'workflows',
    label: '工作流',
    icon: Layers2Icon
  },
  {
    href: 'credentials',
    label: '凭证',
    icon: ShieldCheckIcon
  },
  {
    href: 'billing',
    label: '账单',
    icon: CoinsIcon
  }
] as const

function DesktopSidebar() {
  const pathname = usePathname()
  const activeRoute =
    routes.find(
      (route) =>
        route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0]
  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2 gap-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/${route.href}`}
            className={buttonVariants({
              variant:
                activeRoute && activeRoute.href === route.href
                  ? 'sidebarActiveItem'
                  : 'sidebarItem'
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const activeRoute = routes.find(
    (route) =>
      (route.href.length > 0 && pathname.includes(route.href)) ||
      routes[0]
  )
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4 p-4"
            side="left"
          >
            <SheetTitle className="sr-only">Mobile Nav</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
            <Logo />
            <UserAvailableCreditsBadge />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={`/${route.href}`}
                  className={buttonVariants({
                    variant:
                      activeRoute && activeRoute.href === route.href
                        ? 'sidebarActiveItem'
                        : 'sidebarItem'
                  })}
                  onClick={() => setIsOpen((prev) => !prev)}
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

export default DesktopSidebar
