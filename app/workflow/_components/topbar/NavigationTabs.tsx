'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavigationTabs({
  workflowId
}: {
  workflowId: string
}) {
  const pathname = usePathname()
  const activeValue = pathname?.split('/')[2]
  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            编辑器
          </TabsTrigger>
        </Link>
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            运行统计
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
