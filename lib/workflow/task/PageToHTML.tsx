import { TaskParamType, TaskType } from '@/types/task'
import { CodeIcon, LucideProps } from 'lucide-react'

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: '获取页面 HTML',
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      text: '网址',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    }
  ]
}
