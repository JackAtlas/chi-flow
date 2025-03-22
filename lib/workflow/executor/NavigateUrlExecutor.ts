import { ExecutionEnvironment } from '@/types/executor'
import { NavigateUrlTask } from '../task/NavigateUrl'

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = environment.getInput('URL')
    if (!url) {
      environment.log.error('input -> url is not defined.')
    }

    await environment.getPage()!.goto(url)
    environment.log.info('Navigated to ' + url)
    return true
    // eslint-disable-next-line
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
