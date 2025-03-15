'use client'

import { UpdateWorkflow } from '@/actions/workflows/updateWorkflow'
import { Button } from '@/components/ui/button'
import { WorkflowUpdateResultText } from '@/types/workflow'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow()

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success(WorkflowUpdateResultText.UPDATE_SUCCESS, {
        id: 'save-workflow'
      })
    },
    onError: () => {
      toast.error(WorkflowUpdateResultText.UPDATE_FAIL, {
        id: 'save-workflow'
      })
    }
  })

  return (
    <Button
      disabled={saveMutation.isPending}
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading(WorkflowUpdateResultText.UPDATING, {
          id: 'save-workflow'
        })
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition
        })
      }}
    >
      <CheckIcon size={16} className="stroke-primary" />
      保存
    </Button>
  )
}

export default SaveBtn
