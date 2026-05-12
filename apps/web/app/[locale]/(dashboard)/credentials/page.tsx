import { GetCredentialsForUser } from '@/lib/credentials'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@workspace/ui/components/alert'
import { Card } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import {
  FolderClosedIcon,
  LockKeyholeIcon,
  ShieldIcon,
  ShieldOffIcon
} from 'lucide-react'
import { Suspense } from 'react'
import CreateCredentialDialog from './_components/create-credential-dialog'
import { formatDistanceToNow } from 'date-fns'
import DeleteCredentialDialog from './_components/delete-credential-dialog'
import { useTranslations } from 'next-intl'

export default function CredentialsPage() {
  const t = useTranslations('Credentials')

  return (
    <div className="flex h-full flex-1 flex-col gap-6 px-6">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('desc')}</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <Alert>
        <ShieldIcon className="size-4 stroke-primary" />
        <AlertTitle className="text-primary">{t('statement.title')}</AlertTitle>
        <AlertDescription>{t('statement.desc')}</AlertDescription>
      </Alert>

      <div className="pb-6">
        <Suspense fallback={<Skeleton className="h-75 w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  )
}

async function UserCredentials() {
  const credentials = await GetCredentialsForUser()
  if (!credentials) {
    return <div>Something went wrong</div>
  }

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-accent">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true
        })
        return (
          <Card
            key={credential.id}
            className="flex w-full flex-row justify-between p-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>

            <DeleteCredentialDialog name={credential.name} />
          </Card>
        )
      })}
    </div>
  )
}
