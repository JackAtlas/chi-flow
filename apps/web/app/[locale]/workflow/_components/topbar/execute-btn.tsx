'use client'

import useExecutionPlan from '@/hooks/use-execution-plan'
import { RunWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { useReactFlow } from '@xyflow/react'
import { PlayIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { toast } from 'sonner'

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const t = useTranslations('Workflow')
  const m = useTranslations('Messages')

  const generate = useExecutionPlan()
  const { toObject } = useReactFlow()

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success(t('message.executing'), { id: 'flow-execution' })
    },
    onError: (error) => {
      if (isRedirectError(error)) return
      toast.error(m('Common.Error.later'), { id: 'flow-execution' })
    }
  })
  return (
    <Button
      variant="outline"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => {
        const plan = generate()
        if (!plan) return

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject())
        })
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      {t('button.execute')}
    </Button>
  )
}
