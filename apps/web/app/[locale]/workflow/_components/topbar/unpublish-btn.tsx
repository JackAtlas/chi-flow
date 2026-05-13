'use client'

import { useRouter } from '@/i18n/navigation'
import { UnpublishWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { DownloadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { toast } from 'sonner'

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  const t = useTranslations('Workflow')
  const m = useTranslations('Messages')

  const router = useRouter()
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success(t('message.unpublished'), { id: workflowId })
      router.push(`/workflow/editor/${workflowId}`)
    },
    onError: (error) => {
      if (isRedirectError(error)) return
      toast.error(m('Common.Error.later'), { id: workflowId })
    }
  })
  return (
    <Button
      variant="outline"
      className="flex cursor-pointer items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading(t('message.unpublishing'), { id: workflowId })
        mutation.mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      {t('button.unpublish')}
    </Button>
  )
}
