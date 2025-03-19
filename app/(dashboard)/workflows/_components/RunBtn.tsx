'use client'

import { RunWorkflow } from '@/actions/workflows/runWorkflow'
import { Button } from '@/components/ui/button'
import { WorkflowRunResultText } from '@/types/workflow'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function RunBtn({
  workflowId
}: {
  workflowId: string
}) {
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success(WorkflowRunResultText.STARTED, {
        id: 'flow-execution'
      })
    },
    onError: (err) => {
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
      size="sm"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading(WorkflowRunResultText.PENDING, {
          id: 'flow-execution'
        })
        mutation.mutate({
          workflowId
        })
      }}
    >
      <PlayIcon size={16} />
      执行
    </Button>
  )
}
