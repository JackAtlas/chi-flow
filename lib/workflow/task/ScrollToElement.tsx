import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { ArrowUpIcon } from 'lucide-react'

export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: '滚动到元素',
  icon: (props) => (
    <ArrowUpIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'Web page',
      text: '网页',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: 'Selector',
      text: '选择器',
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
