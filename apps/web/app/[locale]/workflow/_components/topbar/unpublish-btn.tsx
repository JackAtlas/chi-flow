'use client'

import { useRouter } from '@/i18n/navigation'
import { UnpublishWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { DownloadIcon } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { toast } from 'sonner'

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow unpublished', { id: workflowId })
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
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Unpublishing workflow...', { id: workflowId })
        mutation.mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      Unpublish
    </Button>
  )
}
