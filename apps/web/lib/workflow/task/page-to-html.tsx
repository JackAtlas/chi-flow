import { TaskParamType, TaskType, type TaskDescriptor } from '@/types/task'
import { CodeIcon, LucideProps } from 'lucide-react'

export const PageToHtmlTask: TaskDescriptor = {
  type: TaskType.PAGE_TO_HTML,
  label: 'Get html from page',
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    }
  ],
  outputs: [
    {
      name: 'Html',
      type: TaskParamType.STRING
    },
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE
    }
  ]
}
