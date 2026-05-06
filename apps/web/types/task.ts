import type { LucideProps } from 'lucide-react'
import type { ReactNode } from 'react'

export enum TaskType {
  LAUNCH_BROWSER = 'LAUNCH_BROWSER',
  PAGE_TO_HTML = 'PAGE_TO_HTML',
  EXTRACT_TEXT_FROM_ELEMENT = 'EXTRACT_TEXT_FROM_ELEMENT',
  FILL_INPUT = 'FILL_INPUT',
  CLICK_ELEMENT = 'CLICK_ELEMENT',
  WAIT_FOR_ELEMENT = 'WAIT_FOR_ELEMENT',
  DELIVER_VIA_WEBHOOK = 'DELIVER_VIA_WEBHOOK',
  EXTRACT_DATA_WITH_AI = 'EXTRACT_DATA_WITH_AI',
  READ_PROPERTY_FROM_JSON = 'READ_PROPERTY_FROM_JSON',
  ADD_PROPERTY_TO_JSON = 'ADD_PROPERTY_TO_JSON'
}

export enum TaskParamType {
  STRING = 'STRING',
  BROWSER_INSTANCE = 'BROWSER_INSTANCE',
  SELECT = 'SELECT',
  CREDENTIAL = 'CREDENTIAL'
}

export interface TaskParam {
  name: string
  type: TaskParamType
  helperText?: string
  required?: boolean
  hideHandle?: boolean
  value?: string
  [key: string]: any
}

export interface TaskInput {
  name: string
  type: TaskParamType
  helperText?: string
  hideHandle?: boolean
  required?: boolean
  variant?: string
  options?: { label: string; value: string }[]
}

export type TaskOutput = Omit<TaskInput, 'required'>

export interface TaskDescriptor {
  type: TaskType
  label: string
  icon: (props: LucideProps) => ReactNode
  isEntryPoint?: boolean
  credits: number
  inputs: TaskInput[]
  outputs: TaskOutput[]
}
