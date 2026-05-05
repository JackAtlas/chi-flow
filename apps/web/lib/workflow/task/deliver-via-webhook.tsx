import { TaskParamType, TaskType, type TaskDescriptor } from '@/types/task'
import { SendIcon, type LucideProps } from 'lucide-react'

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: 'Deliver Via Webhook',
  icon: (props: LucideProps) => (
    <SendIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'Target URL',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Body',
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [] as const
} satisfies TaskDescriptor
