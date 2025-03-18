import { ExecutionEnvironment } from '@/types/executor'
import { ExtractTextFromElement } from '../task/ExtractTextFromElement'
import * as cheerio from 'cheerio'

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector')
    if (!selector) {
      console.error(`Selector ${selector} not defined.`)
      return false
    }
    const html = environment.getInput('Html')
    if (!html) {
      console.error(`Html not defined.`)
      return false
    }

    const $ = cheerio.load(html)
    const element = $(selector)

    if (!element) {
      console.error(`Element not found with selector: ${selector}`)
      return false
    }

    const extractedText = element.text().trim()
    if (!extractedText) {
      console.error(
        `No text found in element with selector: ${selector}`
      )
      return false
    }
    environment.setOutput('Extracted text', extractedText)

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
