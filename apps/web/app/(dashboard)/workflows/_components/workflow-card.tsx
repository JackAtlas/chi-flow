'use client'

import { Workflow } from '@/generated/prisma/client'
import { WorkflowStatus } from '@/types/workflow'
import { buttonVariants } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'
import { FileTextIcon, PlayIcon, ShuffleIcon } from 'lucide-react'
import Link from 'next/link'
import WorkflowActions from './workflow-actions'

const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary'
}

export default function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  return (
    <Card className="border-separate overflow-hidden rounded-lg border shadow-sm hover:shadow-md dark:shadow-primary/30">
      <CardContent className="flex h-25 items-center justify-between p-4">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="flex items-center text-base font-bold text-muted-foreground">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'sm'
              }),
              'flex items-center gap-2'
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflow={{ id: workflow.id, name: workflow.name }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
