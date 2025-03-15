import { TaskType } from '@/types/task'
import { ExtractTypeFromElement } from './ExtractTextFromElement'
import { LaunchBrowserTask } from './LaunchBrowser'
import { PageToHtmlTask } from './PageToHTML'
import { WorkflowTask } from '@/types/workflow'

type Registry = {
  [K in TaskType]: WorkflowTask
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTypeFromElement
}
