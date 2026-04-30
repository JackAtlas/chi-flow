import { TaskParam } from '@/types/task'
import { cn } from '@workspace/ui/lib/utils'
import { Handle, Position } from '@xyflow/react'
import { ReactNode } from 'react'
import NodeParamField from './node-param-field'

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>
}

export function NodeInput({
  input,
  nodeId
}: {
  input: TaskParam
  nodeId: string
}) {
  return (
    <div className="relative flex w-full justify-start bg-secondary p-3">
      <NodeParamField param={input} nodeId={nodeId} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            'bg-muted-foreground!, border-2!, -left-2! size-4! border-background!'
          )}
        />
      )}
    </div>
  )
}
