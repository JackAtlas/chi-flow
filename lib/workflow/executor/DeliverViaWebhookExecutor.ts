import { ExecutionEnvironment } from '@/types/executor'
import { DeliverViaWebhookTask } from '../task/DeliverViaWebhook'

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput('Target URL')
    if (!targetUrl) {
      environment.log.error('input -> target url is not defined.')
    }
    const body = environment.getInput('Body')
    if (!body) {
      environment.log.error('input -> body is not defined.')
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const statusCode = response.status
    if (statusCode !== 200) {
      environment.log.error(`response status code is ${statusCode}`)
    }

    const responseBody = await response.json()
    environment.log.info(JSON.stringify(responseBody, null, 4))

    return true
    // eslint-disable-next-line
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
