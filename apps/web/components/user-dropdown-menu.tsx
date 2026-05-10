'use client'

import { useRouter } from '@/i18n/navigation'
import { authClient } from '@/lib/auth/auth-client'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'

export function UserDropdownMenu() {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer">{session.data.user.name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => clickHandler()}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } else {
    return <></>
  }
}
