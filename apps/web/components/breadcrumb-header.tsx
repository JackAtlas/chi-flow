'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from '@workspace/ui/components/breadcrumb'
import { Fragment } from 'react'
import { MobileSidebar } from './sidebar'

export default function BreadcrumbHeader() {
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
                  {path === '' ? 'home' : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
