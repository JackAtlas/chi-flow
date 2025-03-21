import { ExecutionEnvironment } from '@/types/executor'
import { ScrollToElementTask } from '../task/ScrollToElement'

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('Selector is not defined.')
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector)
      if (!element) {
        throw new Error(
          `Element with selector ${selector} not found.`
        )
      } else {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }, selector)
    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
