import { Suspense } from 'react'
import UserWorkflowsSkeleton from './_components/user-workflows-skeleton'
import UserWorkflows from './_components/user-workflows'
import CreateWorkflowDialog from './_components/create-workflow-dialog'

export default function WorkflowPage() {
  return (
    <div className="flex h-full flex-1 flex-col px-6">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
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
