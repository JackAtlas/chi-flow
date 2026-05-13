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
import { ExecutionStatusIndicator } from './execution-status'
import type { WorkflowExecutionStatus } from '@/types/workflow'
import { CoinsIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'
import { useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>

export default function ExecutionsTable({
  initialData,
  workflowId
}: {
  initialData: InitialDataType
  workflowId: string
}) {
  const locale = useLocale()
  const t = useTranslations('Workflow.runs')
  const e = useTranslations('Execution.status')

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
              <TableHead>{t('header.status')}</TableHead>
              <TableHead>{t('header.consumed')}</TableHead>
              <TableHead className="text-right text-xs text-muted-foreground">
                {t('header.time')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full gap-2 overflow-auto">
            {query.data.map((execution) => {
              const duration = DatesToDurationString(
                execution.completedAt,
                execution.startedAt
              )
              let timeLocale
              switch (locale) {
                case 'zh':
                  timeLocale = zhCN
                  break
                default:
                  timeLocale = enUS
              }
              const formattedStartedAt =
                execution.startedAt &&
                formatDistanceToNow(execution.startedAt, {
                  addSuffix: true,
                  locale: timeLocale
                })
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{t('trigger.via')}</span>
                        <Badge variant="outline">
                          {execution.trigger === 'CRON' ? (
                            <span className="text-blue-600">
                              {t('trigger.CRON')}
                            </span>
                          ) : (
                            <span className="text-amber-600">
                              {t('trigger.MANUAL')}
                            </span>
                          )}
                        </Badge>
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
                          {e(execution.status as never)}
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
