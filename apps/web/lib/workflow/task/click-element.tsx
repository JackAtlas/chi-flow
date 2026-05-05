import { TaskParamType, TaskType, type TaskDescriptor } from '@/types/task'
import { MousePointerClickIcon, type LucideProps } from 'lucide-react'

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: 'Click element',
  icon: (props: LucideProps) => (
    <MousePointerClickIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: 'Selector',
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
} satisfies TaskDescriptor
