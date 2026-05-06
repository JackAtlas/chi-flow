import { TaskType, type TaskDescriptor } from '@/types/task'
import { LaunchBrowserExecutor } from './launch-browser-executor'
import type { ExecutionEnvironment } from '@/types/executor'
import { PageToHtmlExecutor } from './page-to-html-executor'
import { ExtractTextFromElementExecutor } from './extract-text-from-element-executor'
import { FillInputExecutor } from './fill-input-executor'
import { ClickElementExecutor } from './click-element-executor'
import { WaitForElementExecutor } from './wait-for-element-executor'
import { DeliverViaWebhookExecutor } from './deliver-via-webhook'
import { ExtractDataWithAIExecutor } from './extract-data-with-ai-executor'
import { ReadPropertyFromJSONExecutor } from './read-property-from-json-executor'
import { AddPropertyToJSONExecutor } from './add-property-to-json-executor'

type ExecutorFn<T extends TaskDescriptor> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>

type RegistryType = {
  [K in TaskType]: ExecutorFn<TaskDescriptor & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: PageToHtmlExecutor,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor,
  [TaskType.FILL_INPUT]: FillInputExecutor,
  [TaskType.CLICK_ELEMENT]: ClickElementExecutor,
  [TaskType.WAIT_FOR_ELEMENT]: WaitForElementExecutor,
  [TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookExecutor,
  [TaskType.EXTRACT_DATA_WITH_AI]: ExtractDataWithAIExecutor,
  [TaskType.READ_PROPERTY_FROM_JSON]: ReadPropertyFromJSONExecutor,
  [TaskType.ADD_PROPERTY_TO_JSON]: AddPropertyToJSONExecutor
}
