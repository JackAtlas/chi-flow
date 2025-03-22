import { ExecutionEnvironment } from '@/types/executor'
import { ExtractTextFromElement } from '../task/ExtractTextFromElement'
import * as cheerio from 'cheerio'

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error(`Selector not provided.`)
      return false
    }

    const html = environment.getInput('Html')
    if (!html) {
      environment.log.error(`Html not provided.`)
      return false
    }

    const $ = cheerio.load(html)
    const element = $(selector)

    if (!element) {
      environment.log.error(
        `Element not found with selector: ${selector}`
      )
      return false
    }

    const extractedText = element.text().trim()
    if (!extractedText) {
      environment.log.error(
        `No text found in element with selector: ${selector}`
      )
      return false
    }
    environment.setOutput('Extracted text', extractedText)

    return true
    // eslint-disable-next-line
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
