import type { ExecutionEnvironment } from '@/types/executor'
import type { AddPropertyToJSONTask } from '../task/add-property-to-json'

export async function AddPropertyToJSONExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
): Promise<boolean> {
  console.log('AddPropertyToJSONTask Start')
  try {
    const jsonData = environment.getInput('JSON')
    if (!jsonData) {
      environment.log.error('input -> jsonData not defined')
    }

    const propertyName = environment.getInput('Property name')
    if (!propertyName) {
      environment.log.error('input -> propertyName not defined')
    }

    const propertyValue = environment.getInput('Property value')
    if (!propertyName) {
      environment.log.error('input -> propertyName not defined')
    }

    const json = JSON.parse(jsonData)
    json[propertyName] = propertyValue

    environment.setOutput('Updated JSON', JSON.stringify(json))

    console.log('AddPropertyToJSONTask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('AddPropertyToJSONTask End')
    return false
  }
}
