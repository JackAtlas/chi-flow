'use client'

import { RunWorkflow } from '@/actions/workflows/runWorkflow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { WorkflowRunResultText } from '@/types/workflow'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function ExecuteBtn({
  workflowId
}: {
  workflowId: string
}) {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success(WorkflowRunResultText.STARTED, {
        id: 'flow-execution'
      })
    },
    onError: (err) => {
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
      // redirect internally throws an error
      if (JSON.stringify(err).includes('NEXT_REDIRECT')) {
        toast.success(WorkflowRunResultText.STARTED, {
          id: 'flow-execution'
        })
      } else {
        toast.error(WorkflowRunResultText.FAILED, {
          id: 'flow-execution'
        })
      }
    }
  })
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate()
        if (!plan) return
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      执行
    </Button>
  )
}
