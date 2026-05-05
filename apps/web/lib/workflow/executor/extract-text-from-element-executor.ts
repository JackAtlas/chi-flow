import type { ExecutionEnvironment } from '@/types/executor'
import type { ExtractTextFromElement } from '../task/extract-text-from-element'
import * as cheerio from 'cheerio'

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  console.log('ExtractTextFromElementExecutor Start')
  try {
    console.log('ExtractTextFromElementExecutor, selector')
    const selector = environment.getInput('Selector')
    if (!selector) {
      environment.log.error('Selector not defined')
      return false
    }

    console.log('ExtractTextFromElementExecutor, html')
    const html = environment.getInput('Html')
    if (!html) {
      environment.log.error('Html not defined')
      return false
    }

    const $ = cheerio.load(html)
    const element = $(selector)

    console.log('ExtractTextFromElementExecutor, element')
    if (!element) {
      environment.log.error('Element not found')
      return false
    }

    console.log('ExtractTextFromElementExecutor, extractedText')
    const extractedText = $.text(element)
    if (!extractedText) {
      environment.log.error('Element has no text')
      return false
    }

    console.log('ExtractTextFromElementExecutor, setOutput')
    environment.setOutput('Extracted text', extractedText)

    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    return false
  }
}
