import { GetWorkflowExecutionWithPhase } from '@/actions/workflows/getWorkflowExecutionWithPhase'
import Topbar from '@/app/workflow/_components/topbar/Topbar'
import { Loader2Icon } from 'lucide-react'
import { Suspense } from 'react'
import ExecutionViewer from './_components/ExecutionViewer'

export default async function ExecutionViewerPage({
  params
}: {
  params: Promise<{ executionId: string; workflowId: string }>
}) {
  const { workflowId, executionId } = await params
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="工作流执行细节"
        subtitle={`Run ID: ${executionId}`}
        hideButtons
      />
      <section className="flex flex-1 overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
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
  const workflowExecution = await GetWorkflowExecutionWithPhase(
    executionId
  )
  if (!workflowExecution) {
    return <div>Not found.</div>
  }

  return <ExecutionViewer initialData={workflowExecution} />
}
