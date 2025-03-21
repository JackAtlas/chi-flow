import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { DatabaseIcon } from 'lucide-react'

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: '写入属性',
  icon: (props) => (
    <DatabaseIcon className="stroke-orange-400" {...props} />
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
    },
    {
      name: 'Property value',
      text: '属性值',
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: 'Updated JSON',
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask
