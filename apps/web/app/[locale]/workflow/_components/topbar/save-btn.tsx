'use client'

import { UpdateWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SaveBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter()
  const { toObject } = useReactFlow()

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success('Flow saved successfully', { id: 'save-workflow' })
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'save-workflow' })
    }
  })

  return (
    <Button
      disabled={saveMutation.isPending}
      variant="outline"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading('Saving workflow...', { id: 'save-workflow' })
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition
        })
      }}
    >
      <CheckIcon size={16} className="stroke-gray-400" />
      Save
    </Button>
  )
}
