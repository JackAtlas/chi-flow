import { ExecutionEnvironment } from '@/types/executor'
import { PageToHtmlTask } from '../task/PageToHTML'

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content()
    environment.setOutput('Html', html)
    return true
    // eslint-disable-next-line
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
