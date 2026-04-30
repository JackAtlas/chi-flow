import { TaskType, type TaskDescriptor } from '@/types/task'
import { ExtractTextFromElement } from './extract-text-from-element'
import { LaunchBrowserTask } from './launch-browser'
import { PageToHtmlTask } from './page-to-html'

export const TaskRegistry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserTask,
  [TaskType.PAGE_TO_HTML]: PageToHtmlTask,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElement
} as const satisfies Record<TaskType, TaskDescriptor>
