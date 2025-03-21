import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { BrainIcon } from 'lucide-react'

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: 'AI 提取数据',
  icon: (props) => (
    <BrainIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: 'Content',
      text: '内容',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Credentials',
      text: '凭证',
      type: TaskParamType.CREDENTIAL,
      required: true
    },
    {
      name: 'Prompt',
      text: '提示词',
      type: TaskParamType.STRING,
      required: true,
      variant: 'textarea'
    }
  ] as const,
  outputs: [
    {
      name: 'Extracted Data',
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask
