import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { FileJson2Icon } from 'lucide-react'

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: '读取属性',
  icon: (props) => (
    <FileJson2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'JSON',
      text: 'JSON',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Property name',
      text: '属性名',
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: 'Property value',
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask
