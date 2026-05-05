import type { ExecutionEnvironment } from '@/types/executor'
import type { DeliverViaWebhookTask } from '../task/deliver-via-webhook'

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  console.log('DeliverViaWebhookTask Start')
  try {
    console.log('DeliverViaWebhookTask selector')
    const targetUrl = environment.getInput('Target URL')
    if (!targetUrl) {
      environment.log.error('input -> targetUrl not defined')
    }
    console.log('DeliverViaWebhookTask body')
    const body = environment.getInput('Body')
    if (!body) {
      environment.log.error('input -> body not defined')
    }

    console.log('DeliverViaWebhookTask request')
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const statusCode = response.status
    if (statusCode !== 200) {
      environment.log.error(`status code: ${statusCode}`)
      return false
    }

    console.log('DeliverViaWebhookTask response')
    const responseBody = await response.json()
    environment.log.info(JSON.stringify(responseBody))

    console.log('DeliverViaWebhookTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('DeliverViaWebhookTask End')
    return false
  }
}
