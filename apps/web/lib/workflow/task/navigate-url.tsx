import { TaskParamType, TaskType, type TaskDescriptor } from '@/types/task'
import { Link2Icon, type LucideProps } from 'lucide-react'

export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: 'Navigate Url',
  icon: (props: LucideProps) => (
    <Link2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: 'URL',
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
