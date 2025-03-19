'use client'

import { UnpublishWorkflow } from '@/actions/workflows/unpublishWorkflow'
import useExecutionPlan from '@/components/hooks/useExecutionPlan'
import { Button } from '@/components/ui/button'
import { WorkflowUnpublishResultText } from '@/types/workflow'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { DownloadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function UnpublishBtn({
  workflowId
}: {
  workflowId: string
}) {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success(WorkflowUnpublishResultText.UNPUBLISH_SUCCESS, {
        id: workflowId
      })
    },
    onError: (err) => {
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
      // redirect internally throws an error
      if (JSON.stringify(err).includes('NEXT_REDIRECT')) {
        toast.success(WorkflowUnpublishResultText.UNPUBLISH_SUCCESS, {
          id: workflowId
        })
      } else {
        toast.error(WorkflowUnpublishResultText.UNPUBLISH_FAIL, {
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
        toast.loading(WorkflowUnpublishResultText.UNPUBLISHING, {
          id: workflowId
        })
        mutation.mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      取消发布
    </Button>
  )
}
