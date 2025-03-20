import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { MousePointerClick } from 'lucide-react'

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: '点击页面元素',
  icon: (props) => (
    <MousePointerClick className="stroke-orange-400" {...props} />
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
