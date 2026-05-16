import type { ExecutionEnvironment } from '@/types/executor'
import type { ExtractDataWithAITask } from '../task/extract-data-with-ai'
import prisma from '@/lib/prisma'
import { symmetricDecrypt } from '@/lib/encryption'
import OpenAI from 'openai'

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  console.log('ExtractDataWithAITask Start')
  try {
    const credentials = environment.getInput('Credentials')
    if (!credentials) {
      environment.log.error('input -> credentials not defined')
    }

    const prompt = environment.getInput('Prompt')
    if (!prompt) {
      environment.log.error('input -> prompt not defined')
    }

    const content = environment.getInput('Content')
    if (!content) {
      environment.log.error('input -> content not defined')
    }

    const credential = await prisma.credential.findUnique({
      where: { id: credentials }
    })
    if (!credential) {
      environment.log.error('Credential not found')
      return false
    }

    const plainCredentialValue = symmetricDecrypt(credential.value)
    if (!plainCredentialValue) {
      environment.log.error('Cannot decrypt credential')
      return false
    }

    // const mockExtractedData = {
    //   usernameSelector: '#username',
    //   passwordSelector: '#password',
    //   loginSelector: 'body > div > form > input.btn.btn-primary'
    // }
    // environment.setOutput('Extracted data', JSON.stringify(mockExtractedData))

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: plainCredentialValue
    })

    const response = await openai.chat.completions.create({
      model: 'openrouter/free',
      messages: [
        {
          role: 'system',
          content:
            'You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text'
        },
        {
          role: 'user',
          content
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 1
    })

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`)
    environment.log.info(
      `Completition tokens: ${response.usage?.completion_tokens}`
    )

    const result = response.choices[0]?.message.content
    if (!result) {
      environment.log.error('Empty response from AI')
      return false
    }

    environment.setOutput('Extracted data', result)

    console.log('ExtractDataWithAITask End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('ExtractDataWithAITask End')
    return false
  }
}
