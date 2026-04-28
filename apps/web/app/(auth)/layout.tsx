import Logo from '@/components/logo'
import { ReactNode } from 'react'

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Logo />
      {children}
    </div>
  )
}
