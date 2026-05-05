import { GetWorkflowsForUser } from '@/lib/workflow/workflow'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@workspace/ui/components/alert'
import { AlertCircle, InboxIcon } from 'lucide-react'
import CreateWorkflowDialog from './create-workflow-dialog'
import WorkflowCard from './workflow-card'

export default async function UserWorkflows() {
  try {
    const workflows = await GetWorkflowsForUser()

    if (!workflows) throw new Error()

    if (workflows.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-accent">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No workflow created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first workflow
            </p>
          </div>
          <CreateWorkflowDialog triggerText="Create your first workflow" />
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {workflows.map((workflow, index) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    )
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : `Something went wrong. Please try again later.`}
        </AlertDescription>
      </Alert>
    )
  }
}
