'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@workspace/ui/components/breadcrumb'
import { Fragment } from 'react'
import { MobileSidebar } from './sidebar'
import { usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function BreadcrumbHeader() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const paths = pathname === '/' ? [''] : pathname?.split('/')

  return (
    <div className="flex items-center justify-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink className="capitalize" href={`/${path}`}>
                  {path === '' ? t('home') : t(path)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== paths.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
