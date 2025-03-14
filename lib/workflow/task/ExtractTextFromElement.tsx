import { TaskParamType, TaskType } from '@/types/task'
import { LucideProps, TextIcon } from 'lucide-react'

export const ExtractTypeFromElement = {
  type: TaskType.PAGE_TO_HTML,
  label: '从页面元素中提取文本',
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Html',
      text: 'Html',
      type: TaskParamType.STRING,
      required: true,
      variant: 'textarea'
    },
    {
      name: 'Selector',
      text: '选择器',
      type: TaskParamType.STRING,
      required: true
    }
  ],
  outputs: [
    {
      name: 'Extracted text',
      type: TaskParamType.STRING
    }
  ]
}
