import { ExecutionEnvironment } from '@/types/executor'
import { PageToHtmlTask } from '../task/PageToHTML'

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput('Web page')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
