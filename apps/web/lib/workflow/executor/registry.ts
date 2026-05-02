import { TaskType, type TaskDescriptor } from '@/types/task'
import { LaunchBrowserExecutor } from './launch-browser-executor'
import type { ExecutionEnvironment } from '@/types/executor'
import { PageToHtmlExecutor } from './page-to-html-executor'
import { ExtractTextFromElementExecutor } from './extract-text-from-element-executor'

type ExecutorFn<T extends TaskDescriptor> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>

type RegistryType = {
  [K in TaskType]: ExecutorFn<TaskDescriptor & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: PageToHtmlExecutor,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor
}
