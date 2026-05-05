'use client'

import { Workflow } from '@/generated/prisma/client'
import { WorkflowStatus, type WorkflowExecutionStatus } from '@/types/workflow'
import { buttonVariants } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon
} from 'lucide-react'
import Link from 'next/link'
import WorkflowActions from './workflow-actions'
import RunBtn from './run-btn'
import SchedulerDialog from './scheduler-dialog'
import TooltipWrapper from '@/components/TooltipWrapper'
import { Badge } from '@workspace/ui/components/badge'
import {
  ExecutionStatusIndicator,
  ExecutionStatusLabel
} from '@/app/workflow/runs/[workflowId]/_components/execution-status'
import { format, formatDistanceToNow } from 'date-fns'
import { UTCDate } from '@date-fns/utc'

const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary'
}

export default function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  return (
    <Card className="border-separate overflow-hidden rounded-lg border pb-0 shadow-sm hover:shadow-md dark:shadow-primary/30">
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
            <SchedulerSection
              creditsCost={workflow.creditsCost}
              cron={workflow.cron}
              isDraft={isDraft}
              workflowId={workflow.id}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
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
      <LastRunDetails workflow={workflow} />
    </Card>
  )
}

function SchedulerSection({
  creditsCost,
  cron,
  isDraft,
  workflowId
}: {
  creditsCost: number
  cron: string | null
  isDraft: boolean
  workflowId: string
}) {
  if (isDraft) return null
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="size-4 text-muted-foreground" />
      <SchedulerDialog
        cron={cron}
        workflowId={workflowId}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="size-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 rounded-sm text-muted-foreground"
          >
            <CoinsIcon className="size-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  )
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  if (isDraft) return null
  const { lastRunAt, lastRunId, lastRunStatus, nextRunAt } = workflow
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true })
  const nextSchedule = nextRunAt && format(nextRunAt, 'yyyy-MM-dd HH:mm')
  const nextScheduleUTC = nextRunAt && format(new UTCDate(nextRunAt), 'HH:mm')
  return (
    <div className="flex items-center justify-between bg-primary/5 px-4 py-1 text-muted-foreground">
      <div className="flex items-center gap-2 text-sm">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="group flex items-center gap-2 text-sm"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="translate-x-0.5 transition group-hover:translate-x-0"
            />
          </Link>
        )}
        {!lastRunAt && <p>No runs yet</p>}
      </div>
      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  )
}
