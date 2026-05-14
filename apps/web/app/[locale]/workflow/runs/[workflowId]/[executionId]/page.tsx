import Topbar from '@/app/[locale]/workflow/_components/topbar/topbar'
import { auth } from '@/lib/auth/auth'
import { GetWorkflowExecutionWithPhases } from '@/lib/workflow/workflow'
import { Loader2Icon } from 'lucide-react'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import ExecutionViewer from './_components/execution-viewer'
import { getTranslations } from 'next-intl/server'

export default async function RunPage({
  params
}: {
  params: Promise<{
    executionId: string
    workflowId: string
  }>
}) {
  const t = await getTranslations('Execution')

  const { executionId, workflowId } = await params
  return (
    <>
      <Topbar
        workflowId={workflowId}
        title={t('detail.title')}
        subTitle={`${t('detail.desc')}${executionId}`}
        hideButtons
      />
      <section className="flex flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="size-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </>
  )
}

async function ExecutionViewerWrapper({
  executionId
}: {
  executionId: string
}) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) return <div>Unauthenticated</div>

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId)
  if (!workflowExecution) {
    return <div>Not found</div>
  }

  return <ExecutionViewer initialData={workflowExecution} />
}
