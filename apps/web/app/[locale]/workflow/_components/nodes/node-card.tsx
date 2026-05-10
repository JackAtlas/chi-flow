'use client'

import useFlowValidation from '@/hooks/use-flow-validation'
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
  const { invalidInputs } = useFlowValidation()
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId)

  return (
    <div
      className={cn(
        'flex w-105 border-separate cursor-pointer flex-col gap-1 rounded-md border-2 bg-background text-xs',
        isSelected && 'border-primary',
        hasInvalidInputs && 'border-2 border-destructive'
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
