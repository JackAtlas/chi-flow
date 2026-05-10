'use client'

import { useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth/auth-client'
import { Button } from '@workspace/ui/components/button'

export function SignOutButton() {
  const router = useRouter()
  const session = authClient.useSession()

  const clickHandler = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signIn')
        }
      }
    })
  }

  if (session.data?.user) {
    return (
      <Button onClick={() => clickHandler()} className="group cursor-pointer">
        <span className="group-hover:hidden">{session.data.user.name}</span>
        <span className="hidden group-hover:inline-block">登出</span>
      </Button>
    )
  } else {
    return <></>
  }
}
