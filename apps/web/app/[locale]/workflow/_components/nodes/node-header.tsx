'client component'

import { CreateFlowNode } from '@/lib/workflow/node'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import type { AppNode } from '@/types/appNode'
import { TaskType } from '@/types/task'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { useReactFlow } from '@xyflow/react'
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'

export default function NodeHeader({
  taskType,
  nodeId
}: {
  taskType: TaskType
  nodeId: string
}) {
  const task = TaskRegistry[taskType]
  const { addNodes, deleteElements, getNode } = useReactFlow()
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex w-full items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground uppercase">
          {task.label}
        </p>
        <div className="flex items-center gap-1">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="flex items-center gap-2 text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }]
                  })
                }}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => {
                  const node = getNode(nodeId) as AppNode
                  const newX = node.position.x
                  const newY =
                    node.position.y + (node.measured?.height || 200) + 20
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY
                  })
                  addNodes(newNode)
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
