import { GetWorkflowExecutions } from '@/lib/workflow/workflow'
import Topbar from '../../_components/topbar/topbar'
import { Suspense } from 'react'
import { InboxIcon, Loader2Icon } from 'lucide-react'
import ExecutionsTable from './_components/executions-table'

export default async function ExecutionPage({
  params
}: {
  params: Promise<{ workflowId: string }>
}) {
  const { workflowId } = await params
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        title="All runs"
        subTitle="List of all your workflow runs"
        workflowId={workflowId}
        hideButtons
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId)
  if (!executions) return <div>No data</div>

  if (executions.length === 0) {
    return (
      <div className="w-full py-6">
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <div className="flex size-20 items-center justify-center rounded-full bg-accent">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <ExecutionsTable workflowId={workflowId} initialData={executions} />
}
