'client component'

import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { CoinsIcon, GripVerticalIcon } from 'lucide-react'

export default function NodeHeader({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType]
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
            TODO
          </Badge>
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
