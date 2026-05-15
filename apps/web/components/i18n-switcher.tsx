'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { LanguagesIcon } from 'lucide-react'
import { useTransition } from 'react'

export function I18NSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function setLocale(locale: string) {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('zh')}>
          简体中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
