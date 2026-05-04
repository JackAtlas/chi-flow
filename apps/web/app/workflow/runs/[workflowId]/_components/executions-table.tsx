'use client'

import { DatesToDurationString } from '@/lib/helpers/dates'
import { GetWorkflowExecutions } from '@/lib/workflow/workflow'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@workspace/ui/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table'
import ExecutionStatusIndicator from './execution-status-indicator'
import type { WorkflowExecutionStatus } from '@/types/workflow'
import { CoinsIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>

export default function ExecutionsTable({
  initialData,
  workflowId
}: {
  initialData: InitialDataType
  workflowId: string
}) {
  const router = useRouter()
  const query = useQuery({
    queryKey: ['executions', workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000
  })
  return (
    <div className="p-6">
      <div className="overflow-auto rounded-lg border shadow-md">
        <Table className="h-full">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consumed</TableHead>
              <TableHead className="text-right text-xs text-muted-foreground">
                Started at (desc)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full gap-2 overflow-auto">
            {query.data.map((execution) => {
              const duration = DatesToDurationString(
                execution.completedAt,
                execution.startedAt
              )
              const formattedStartedAt =
                execution.startedAt &&
                formatDistanceToNow(execution.startedAt, { addSuffix: true })
              return (
                <TableRow
                  key={execution.id}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/workflow/runs/${execution.workflowId}/${execution.id}`
                    )
                  }}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{execution.id}</span>
                      <div className="text-xs text-muted-foreground">
                        <span>Triggered via</span>
                        <Badge variant="outline">{execution.trigger}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <ExecutionStatusIndicator
                          status={execution.status as WorkflowExecutionStatus}
                        />
                        <span className="font-semibold capitalize">
                          {execution.status}
                        </span>
                      </div>
                      <div className="mx-5 text-xs text-muted-foreground">
                        {duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <CoinsIcon size={16} className="text-primary" />
                        <span className="font-semibold capitalize">
                          {execution.creditsConsumed}
                        </span>
                      </div>
                      <div className="mx-5 text-xs text-muted-foreground">
                        Credits
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formattedStartedAt}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
