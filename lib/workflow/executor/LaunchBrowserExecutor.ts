import { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/LaunchBrowser'

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput('Website Url')
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
      // args: ["--proxy-server=brd.superproxy.io:22225"] use proxy server to change IP to bypass robot detection
    })
    environment.log.info('Launched browser successfully.')
    environment.setBrowser(browser)
    const page = await browser.newPage()
    // await page.authenticate({ // user info for proxy server
    //   username: "",
    //   password: ""
    // })
    await page.goto(websiteUrl)
    environment.setPage(page)
    environment.log.info(`Opened page at: ${websiteUrl}`)
    return true
    // eslint-disable-next-line
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
