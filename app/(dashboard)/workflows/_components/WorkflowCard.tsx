'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  WorkflowExecutionStatus,
  WorkflowStatus
} from '@/types/workflow'
import { Workflow } from '@prisma/client'
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import TooltipWrapper from '@/components/TooltipWrapper'
import DeleteWorkflowDialog from './DeleteWorkflowDialog'
import RunBtn from './RunBtn'
import SchedulerDialog from './SchedulerDialog'
import { Badge } from '@/components/ui/badge'
import ExecutionStatusIndicator, {
  ExecutionStatusLabel
} from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator'
import { format, formatDistanceToNow } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  const statusColors = {
    [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
    [WorkflowStatus.PUBLISHED]: 'bg-emerald-500'
  }
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-flex">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="flex items-center ml-2 px-2 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  草稿
                </span>
              )}
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
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
            编辑
          </Link>
          <WorkflowActions
            workflowId={workflow.id}
            workflowName={workflow.name}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  )
}

function WorkflowActions({
  workflowName,
  workflowId
}: {
  workflowId: string
  workflowName: string
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowId={workflowId}
        workflowName={workflowName}
      ></DeleteWorkflowDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} size={'sm'}>
            <TooltipWrapper content={'更多操作'}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>操作</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onClick={() => setShowDeleteDialog(true)}
          >
            <TrashIcon size={16} />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function ScheduleSection({
  isDraft,
  creditCost,
  workflowId,
  cron
}: {
  isDraft: boolean
  creditCost: number
  workflowId: string
  cron: string | null
}) {
  if (isDraft) return null
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  )
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  if (isDraft) return null
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true })
  const nextSchedule =
    nextRunAt && format(nextRunAt, 'yyyy-MM-dd HH:mm')
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, 'UTC', 'HH:mm')
  return (
    <div className="bg-primary/5 -my-6 px-4 py-2 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
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
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        )}
        {!lastRunAt && <span>No runs yet</span>}
      </div>
      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  )
}

export default WorkflowCard
