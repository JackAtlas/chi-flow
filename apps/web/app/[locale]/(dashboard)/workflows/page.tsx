import { Suspense } from 'react'
import UserWorkflowsSkeleton from './_components/user-workflows-skeleton'
import UserWorkflows from './_components/user-workflows'
import CreateWorkflowDialog from './_components/create-workflow-dialog'
import { getTranslations } from 'next-intl/server'

export default async function WorkflowPage() {
  const t = await getTranslations('Workflows')
  return (
    <div className="flex h-full flex-1 flex-col px-6">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('desc')}</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  )
}
