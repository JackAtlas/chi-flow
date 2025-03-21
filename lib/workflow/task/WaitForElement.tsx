import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { EyeIcon } from 'lucide-react'

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: '等待页面元素',
  icon: (props) => (
    <EyeIcon className="stroke-amber-400" {...props} />
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
    },
    {
      name: 'Visibility',
      text: '可见性',
      type: TaskParamType.SELECT,
      hideHandle: true,
      required: true,
      options: [
        { label: '可见', value: 'visible' },
        { label: '隐藏', value: 'hidden' }
      ]
    }
  ] as const,
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE
    }
  ] as const
} satisfies WorkflowTask
