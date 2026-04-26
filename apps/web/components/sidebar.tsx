"use client"

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  LucideIcon,
  ShieldCheckIcon,
} from "lucide-react"
import Logo from "./logo"
import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

type Route = {
  href: string
  label: string
  icon: LucideIcon
}

const routes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon,
  },
] as const

export default function DesktopSidebar() {
  const pathname = usePathname()
  const activeRoute: Route =
    routes.find(
      (routes) => routes.href.length > 0 && pathname.includes(routes.href)
    ) || routes[0]
  return (
    <div className="relative hidden h-screen w-full max-w-70 border-separate overflow-hidden border-r-2 bg-primary/5 text-muted-foreground md:block dark:bg-secondary/30 dark:text-foreground">
      <div className="flex border-separate items-center justify-center gap-2 border-b p-4">
        <Logo />
      </div>
      <div className="p-2">TODO CREDITS</div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              buttonVariants(),
              "justify-start gap-2",
              activeRoute!.href === route.href
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-transparent text-secondary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            )}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
