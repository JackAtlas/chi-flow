import type { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import type { LaunchBrowserTask } from '../task/launch-browser'

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  console.log('LaunchBrowserExecutor Start')
  try {
    const websiteUrl = environment.getInput('Website Url')
    const browser = await puppeteer.launch({
      headless: false
    })
    environment.log.info('Browser started successfully')
    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl, { timeout: 0 })
    environment.setPage(page)
    environment.log.info(`Open page at: ${websiteUrl}`)
    console.log('LaunchBrowserExecutor End')
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      environment.log.error(error.message)
    } else {
      environment.log.error('Unknown error')
    }
    console.log('LaunchBrowserExecutor End')
    return false
  }
}
