import type { ExecutionEnvironment } from '@/types/executor'
import type { ClickElementTask } from '../task/click-element'

export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  console.log('ClickElementTask Start')
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input -> selector not defined')
    }

    await environment.getPage()?.click(selector)

    console.log('ClickElementTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('ClickElementTask End')
    return false
  }
}
