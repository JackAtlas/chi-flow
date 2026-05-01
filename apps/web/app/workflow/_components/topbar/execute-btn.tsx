'use client'

import useExecutionPlan from '@/hooks/use-execution-plan'
import { Button } from '@workspace/ui/components/button'
import { PlayIcon } from 'lucide-react'

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan()
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate()
      }}
    >
      <PlayIcon size={16} className="cursor-pointer stroke-orange-400" />
      Execute
    </Button>
  )
}
