import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { Link2Icon } from 'lucide-react'

export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: '跳转链接',
  icon: (props) => (
    <Link2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: 'Web page',
      text: '网页',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: 'URL',
      text: '网页地址',
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE
    }
  ] as const
} satisfies WorkflowTask
