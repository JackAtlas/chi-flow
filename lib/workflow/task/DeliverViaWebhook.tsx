import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { SendIcon } from 'lucide-react'

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: '通过 webhook 发送',
  icon: (props) => (
    <SendIcon className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'Target URL',
      text: '目标网址',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Body',
      text: '主体',
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [] as const
} satisfies WorkflowTask
