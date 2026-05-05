import { TaskType, type TaskDescriptor } from '@/types/task'
import { ExtractTextFromElementTask } from './extract-text-from-element'
import { LaunchBrowserTask } from './launch-browser'
import { PageToHtmlTask } from './page-to-html'
import { FillInputTask } from './fill-input'
import { ClickElementTask } from './click-element'
import { WaitForElementTask } from './wait-for-element'

type Registry = {
  [K in TaskType]: TaskDescriptor & { type: K }
}

export const TaskRegistry: Registry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserTask,
  [TaskType.PAGE_TO_HTML]: PageToHtmlTask,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementTask,
  [TaskType.FILL_INPUT]: FillInputTask,
  [TaskType.CLICK_ELEMENT]: ClickElementTask,
  [TaskType.WAIT_FOR_ELEMENT]: WaitForElementTask
}
