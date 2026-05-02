import type { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import type { LaunchBrowserTask } from '../task/launch-browser'

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput('Website Url')
    const browser = await puppeteer.launch()
    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl, { timeout: 0 })
    environment.setPage(page)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
