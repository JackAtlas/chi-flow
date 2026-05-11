'use client'

import { capitalize } from '@/lib/utils'
import { RunWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { PlayIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { toast } from 'sonner'

export default function RunBtn({ workflowId }: { workflowId: string }) {
  const t = useTranslations('Workflows.operations')
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success('Workflow started', { id: workflowId })
    },
    onError: (error) => {
      if (isRedirectError(error)) {
        toast.success('Workflow started', { id: workflowId })
      } else {
        toast.error('Something went wrong', { id: workflowId })
      }
    }
  })
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex cursor-pointer items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Scheduling run...', { id: workflowId })
        mutation.mutate({ workflowId })
      }}
    >
      <PlayIcon size={16} />
      {capitalize(t('run'))}
    </Button>
  )
}
