export enum TaskType {
  LAUNCH_BROWSER = 'LAUNCH_BROWSER',
  PAGE_TO_HTML = 'PAGE_TO_HTML'
}

export enum TaskParamType {
  STRING = 'STRING',
  BROWSER_INSTANCE = 'BROWSER_INSTANCE',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN'
}

export interface TaskParam {
  name: string
  text: string
  type: TaskParamType
  helperText?: string
  required?: boolean
  hideHandle?: boolean
  [key: string]: any
}
