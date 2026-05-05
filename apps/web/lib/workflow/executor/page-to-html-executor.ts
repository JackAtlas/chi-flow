import type { ExecutionEnvironment } from '@/types/executor'
import type { PageToHtmlTask } from '../task/page-to-html'

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  console.log('PageToHtmlExecutor Start')
  try {
    const html = await environment.getPage()!.content()
    environment.setOutput('Html', html)
    console.log('PageToHtmlExecutor End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('PageToHtmlExecutor End')
    return false
  }
}
