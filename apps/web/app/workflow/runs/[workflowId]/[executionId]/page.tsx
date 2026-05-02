import Topbar from '@/app/workflow/_components/topbar/topbar'
import { auth } from '@/lib/auth/auth'
import { GetWorkflowExecutionWithPhases } from '@/lib/workflow/workflow'
import { Loader2Icon } from 'lucide-react'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import ExecutionViewer from './_components/execution-viewer'

export default async function RunPage({
  params
}: {
  params: Promise<{
    executionId: string
    workflowId: string
  }>
}) {
  const { executionId, workflowId } = await params
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subTitle={`Run ID: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full">
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
    </div>
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
