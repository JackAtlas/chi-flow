import { GetWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions'
import Topbar from '../../_components/topbar/Topbar'
import { Suspense } from 'react'
import { InboxIcon, Loader2Icon } from 'lucide-react'
import ExecutionsTable from './_components/ExecutionsTable'

export default async function ExecutionsPage({
  params
}: {
  params: Promise<{
    workflowId: string
  }>
}) {
  const { workflowId } = await params
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={workflowId}
        hideButtons
        title="运行"
        subtitle="工作流的所有运行统计"
      />
      <Suspense
        fallback={
          <div className="flex w-full h-full items-center justify-center">
            <Loader2Icon
              size={30}
              className="animate-spin stroke-primary"
            />
          </div>
        }
      >
        <ExecutionTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionTableWrapper({
  workflowId
}: {
  workflowId: string
}) {
  const executions = await GetWorkflowExecutions(workflowId)
  if (!executions) return <div>No data</div>

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">这个工作流还没运行过</p>
            <p className="text-sm text-muted-foreground">
              您可以在编辑器界面发起运行
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionsTable
        workflowId={workflowId}
        initialData={executions}
      />
    </div>
  )
}
