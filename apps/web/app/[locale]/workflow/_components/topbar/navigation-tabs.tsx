'use client'

import { usePathname } from '@/i18n/navigation'
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function NavigationTabs({ workflowId }: { workflowId: string }) {
  const t = useTranslations('Workflow.tabs')

  const pathname = usePathname()
  const activeValue = pathname?.split('/')[2]
  return (
    <Tabs value={activeValue} className="w-100">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            {t('editor')}
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            {t('runs')}
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
