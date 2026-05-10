'use client'

import type { TaskParam } from '@/types/task'
import { cn } from '@workspace/ui/lib/utils'
import { Handle, Position } from '@xyflow/react'
import type { ReactNode } from 'react'
import { ColorForHandle } from './common'

export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1 divide-y">{children}</div>
}

export function NodeOutput({ output }: { output: TaskParam }) {
  return (
    <div className="relative flex justify-end bg-secondary p-3 last-of-type:rounded-b-sm">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          '-right-2! size-4! border-2! border-background! bg-muted-foreground!',
          ColorForHandle[output.type]
        )}
      />
    </div>
  )
}
