'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from './ui/breadcrumb'
import { MobileSidebar } from './Sidebar'
import { routes } from './Sidebar'

function BreadcrumbHeader() {
  const pathname = usePathname()
  const paths = pathname === '/' ? [''] : pathname?.split('/')

  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => {
            const label = routes.find(
              (route) => route.href === path
            )?.label
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="capitalize"
                    href={`/${path}`}
                  >
                    {label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== paths.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader
