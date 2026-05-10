import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing } from './routing'

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale = store.get('locale')?.value || routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
