'use client'

import useExecutionPlan from '@/hooks/use-execution-plan'
import { RunWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { useReactFlow } from '@xyflow/react'
import { PlayIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success('Execution started', { id: 'flow-execution' })
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'flow-execution' })
    }
  })
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate()
        if (!plan) return

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <PlayIcon size={16} className="cursor-pointer stroke-orange-400" />
      Execute
    </Button>
  )
}
