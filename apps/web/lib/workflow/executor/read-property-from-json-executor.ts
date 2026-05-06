import type { ExecutionEnvironment } from '@/types/executor'
import type { ReadPropertyFromJSONTask } from '../task/read-property-from-json'

export async function ReadPropertyFromJSONExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> {
  console.log('ReadPropertyFromJSONTask Start')
  try {
    const jsonData = environment.getInput('JSON')
    if (!jsonData) {
      environment.log.error('input -> jsonData not defined')
    }

    const propertyName = environment.getInput('Property name')
    if (!propertyName) {
      environment.log.error('input -> propertyName not defined')
    }

    const json = JSON.parse(jsonData)
    const propertyValue = json[propertyName]
    if (propertyValue === undefined) {
      environment.log.error('property not found')
      return false
    }

    environment.setOutput('Property value', propertyValue)

    console.log('ReadPropertyFromJSONTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('ReadPropertyFromJSONTask End')
    return false
  }
}
