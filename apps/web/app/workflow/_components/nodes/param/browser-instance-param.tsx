'use client'

import type { ParamProps } from '@/types/appNode'

export default function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>
}
