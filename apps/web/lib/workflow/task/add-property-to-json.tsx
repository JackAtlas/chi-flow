import { TaskParamType, TaskType, type TaskDescriptor } from '@/types/task'
import { DatabaseIcon, type LucideProps } from 'lucide-react'

export const AddPropertyToJSONTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: 'Add property to JSON',
  icon: (props: LucideProps) => (
    <DatabaseIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'JSON',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Property name',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Property value',
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
} satisfies TaskDescriptor
