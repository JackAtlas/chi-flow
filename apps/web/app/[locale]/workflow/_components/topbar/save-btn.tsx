'use client'

import { UpdateWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export default function SaveBtn({ workflowId }: { workflowId: string }) {
  const t = useTranslations('Workflow')
  const m = useTranslations('Messages')

  const { toObject } = useReactFlow()

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success(t('message.saved'), { id: 'save-workflow' })
    },
    onError: () => {
      toast.error(m('Common.Error.later'), { id: 'save-workflow' })
    }
  })

  return (
    <Button
      disabled={saveMutation.isPending}
      variant="outline"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading(t('message.saving'), { id: 'save-workflow' })
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition
        })
      }}
    >
      <CheckIcon size={16} className="stroke-gray-400" />
      {t('button.save')}
    </Button>
  )
}
