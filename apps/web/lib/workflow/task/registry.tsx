import { TaskType, type TaskDescriptor } from '@/types/task'
import { ExtractTextFromElement } from './extract-text-from-element'
import { LaunchBrowserTask } from './launch-browser'
import { PageToHtmlTask } from './page-to-html'

type Registry = {
  [K in TaskType]: TaskDescriptor & { type: K }
}

export const TaskRegistry: Registry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserTask,
  [TaskType.PAGE_TO_HTML]: PageToHtmlTask,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElement
}
