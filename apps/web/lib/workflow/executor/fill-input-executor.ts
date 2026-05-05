import type { ExecutionEnvironment } from '@/types/executor'
import type { FillInputTask } from '../task/fill-input'

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  console.log('FillInputExecutor Start')
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input -> selector not defined')
    }

    const value = environment.getInput('Value')
    if (!value) {
      environment.log.error('input -> value not defined')
    }

    await environment.getPage()!.type(selector, value)

    console.log('FillInputExecutor End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('FillInputExecutor End')
    return false
  }
}
