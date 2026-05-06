import type { ExecutionEnvironment } from '@/types/executor'
import type { NavigateUrlTask } from '../task/navigate-url'

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  console.log('NavigateUrlTask Start')
  try {
    const url = environment.getInput('URL')
    if (!url) {
      environment.log.error('input -> url not defined')
    }

    await environment.getPage()?.goto(url)
    environment.log.info(`Visited ${url}`)

    console.log('NavigateUrlTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('NavigateUrlTask End')
    return false
  }
}
