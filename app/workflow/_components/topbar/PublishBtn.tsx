'use client'

import { PublishWorkflow } from '@/actions/workflows/publishWorkflow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { WorkflowPublishResultText } from '@/types/workflow'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { UploadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function PublishBtn({
  workflowId
}: {
  workflowId: string
}) {
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success(WorkflowPublishResultText.PUBLISH_SUCCESS, {
        id: workflowId
      })
    },
    onError: (err) => {
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
      // redirect internally throws an error
      if (JSON.stringify(err).includes('NEXT_REDIRECT')) {
        toast.success(WorkflowPublishResultText.PUBLISH_SUCCESS, {
          id: workflowId
        })
      } else {
        toast.error(WorkflowPublishResultText.PUBLISH_FAIL, {
          id: workflowId
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
        toast.loading(WorkflowPublishResultText.PUBLISHING, {
          id: workflowId
        })
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      发布
    </Button>
  )
}
