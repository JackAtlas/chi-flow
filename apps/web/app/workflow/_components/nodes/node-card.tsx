'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useReactFlow } from '@xyflow/react'
import { ReactNode } from 'react'

export default function NodeCard({
  children,
  isSelected,
  nodeId
}: {
  children: ReactNode
  isSelected: boolean
  nodeId: string
}) {
  const { getNode, setCenter } = useReactFlow()
  return (
    <div
      className={cn(
        'flex w-105 border-separate cursor-pointer flex-col gap-1 overflow-hidden rounded-md border-2 bg-background text-xs',
        isSelected && 'border-primary'
      )}
      onDoubleClick={() => {
        const node = getNode(nodeId)
        if (!node) return
        const { position, measured } = node
        if (!position || !measured) return
        const { width, height } = measured
        const x = position.x + width! / 2
        const y = position.y + height! / 2
        if (x === undefined || y === undefined) return

        setCenter(x, y, {
          zoom: 1,
          duration: 500
        })
      }}
    >
      {children}
    </div>
  )
}
