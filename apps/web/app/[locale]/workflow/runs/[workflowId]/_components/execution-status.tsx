import type { WorkflowExecutionStatus } from '@/types/workflow'
import { cn } from '@workspace/ui/lib/utils'
import { useTranslations } from 'next-intl'

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: 'bg-slate-400',
  RUNNING: 'bg-yellow-400',
  FAILED: 'bg-red-400',
  COMPLETED: 'bg-emerald-600'
}

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: 'text-slate-400',
  RUNNING: 'text-yellow-400',
  FAILED: 'text-red-400',
  COMPLETED: 'text-emerald-600'
}

export function ExecutionStatusIndicator({
  status
}: {
  status: WorkflowExecutionStatus
}) {
  return (
    <div className={cn('size-2 rounded-full', indicatorColors[status])}></div>
  )
}

export function ExecutionStatusLabel({
  status
}: {
  status: WorkflowExecutionStatus
}) {
  const t = useTranslations('Execution.status')
  return (
    <span className={cn('lowercase', labelColors[status])}>{t(status)}</span>
  )
}
