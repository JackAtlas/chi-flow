import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { Edit3Icon } from 'lucide-react'

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: '填写输入框',
  icon: (props) => (
    <Edit3Icon className="stroke-orange-400" {...props} />
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
      name: 'Value',
      text: '值',
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
