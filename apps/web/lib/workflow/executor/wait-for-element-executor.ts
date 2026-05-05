import type { ExecutionEnvironment } from '@/types/executor'
import type { WaitForElementTask } from '../task/wait-for-element'

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  console.log('WaitForElementTask Start')
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input -> selector not defined')
    }
    const visibility = environment.getInput('Visibility')
    if (!visibility) {
      environment.log.error('input -> visibility not defined')
    }

    await environment.getPage()?.waitForSelector(selector, {
      timeout: 0,
      visible: visibility === 'visible',
      hidden: visibility === 'hidden'
    })
    environment.log.info(`Element ${selector} became: ${visibility}`)

    console.log('WaitForElementTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('WaitForElementTask End')
    return false
  }
}
