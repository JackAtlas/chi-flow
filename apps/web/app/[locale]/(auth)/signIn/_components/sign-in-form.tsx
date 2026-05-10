'use client'

import { useRouter } from '@/i18n/navigation'
import { getDemoUsers } from '@/lib/actions/auth/users'
import { authClient } from '@/lib/auth/auth-client'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type DemoUser = Awaited<ReturnType<typeof getDemoUsers>>[number]

export default function SignInForm() {
  const router = useRouter()
  const [users, setUsers] = useState<DemoUser[]>([])
  const [loadingUser, setLoadingUser] = useState<string | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const { data: session } = authClient.useSession()

  const DEMO_PASSWORD = process.env['NEXT_PUBLIC_DEMO_PASSWORD'] as string
  const AVATAR_URL = process.env['NEXT_PUBLIC_AVATAR_URL'] as string

  useEffect(() => {
    getDemoUsers()
      .then(setUsers)
      .finally(() => setIsInitialLoading(false))
  }, [])

  const handleSignIn = async (email: string) => {
    setLoadingUser(email)

    const { error } = await authClient.signIn.email({
      email,
      password: DEMO_PASSWORD,
      callbackURL: '/'
    })

    if (error) {
      toast.error(error.message || '登录失败')
      setLoadingUser(null)
    } else {
      toast.success('登录成功，欢迎回来')
      router.push('/')
    }
  }

  return (
    <Card className="w-full md:max-w-lg">
      <CardHeader>
        <CardTitle>选择账号登录</CardTitle>
        <CardDescription>
          演示环境：点击下方离线用户卡片即可登录
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <Loader2Icon className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">加载测试账号……</p>
          </div>
        ) : (
          users.map((user) => {
            const isCurrent = session?.user.id === user.id
            const isDisabled = !!loadingUser || user.isOnline
            return (
              <Button
                key={user.id}
                variant={isCurrent ? 'secondary' : 'outline'}
                className={cn(
                  'group flex h-auto items-center justify-between gap-4 p-4 transition-all hover:border-primary',
                  !isDisabled && 'cursor-pointer'
                )}
                disabled={isDisabled}
                onClick={() => handleSignIn(user.email)}
              >
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-secondary">
                      <Image
                        src={AVATAR_URL + '?seed=' + user.name}
                        alt={user.name}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="text-left">
                      <p className="leading-none font-medium">{user.name}</p>
                    </div>
                    {loadingUser === user.email && (
                      <Loader2Icon className="size-4 animate-spin" />
                    )}
                  </div>
                  {user.isOnline ? (
                    <div className="relative size-2.5 rounded-full bg-green-500">
                      <div className="absolute inset-0 animate-ping rounded-full bg-green-500"></div>
                    </div>
                  ) : (
                    <div className="size-2.5 rounded-full bg-accent"></div>
                  )}
                </div>
              </Button>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
