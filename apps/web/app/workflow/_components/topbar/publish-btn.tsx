'use client'

import useExecutionPlan from '@/hooks/use-execution-plan'
import { PublishWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { useReactFlow } from '@xyflow/react'
import { UploadIcon } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PublishBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter()
  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow published', { id: workflowId })
      router.push(`/workflow/editor/${workflowId}`)
    },
    onError: (error) => {
      if (isRedirectError(error)) return
      toast.error('Something went wrong', { id: workflowId })
    }
  })
  return (
    <Button
      variant="outline"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => {
        const plan = generate()
        if (!plan) return

        toast.loading('Publishing workflow...', { id: workflowId })
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  )
}
