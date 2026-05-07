import type { ExecutionEnvironment } from '@/types/executor'
import type { ScrollToElementTask } from '../task/scroll-to-element'
import { waitFor } from '@/lib/helpers/waitFor'

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  console.log('ScrollToElementTask Start')
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('input -> selector not defined')
    }

    await environment.getPage()?.evaluate((selector) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error('Element not found')
      // const top = element.getBoundingClientRect().y + window.scrollY
      // window.scrollTo({ top })
      element.scrollIntoView()
    }, selector)

    await waitFor(10000)
    console.log('ScrollToElementTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('ScrollToElementTask End')
    return false
  }
}
