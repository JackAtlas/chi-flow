'use client'

import {
  GetWorkflowExecutionWithPhases,
  GetWorkflowPhaseDetails
} from '@/lib/workflow/workflow'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  WorkflowIcon,
  type LucideIcon
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState, type ReactNode } from 'react'
import { Separator } from '@workspace/ui/components/separator'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { DatesToDurationString } from '@/lib/helpers/dates'
import { GetPhasesTotalCost } from '@/lib/helpers/phases'

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

export default function ExecutionViewer({
  initialData
}: {
  initialData: ExecutionData
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const query = useQuery({
    queryKey: ['execution', initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 3000 : false
  })

  const phaseDetails = useQuery({
    queryKey: ['phaseDetails', selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
  })

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.createdAt
  )

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || [])
  return (
    <>
      <aside className="flex w-110 max-w-110 min-w-110 grow border-separate flex-col overflow-y-auto border-r-2">
        <div className="px-2 py-4">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.createdAt), {
                      addSuffix: true
                    })
                  : '-'}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits consumed"
            value={creditsConsumed}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-center px-4 py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="h-full overflow-auto px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? 'secondary' : 'ghost'}
              onClick={() => {
                if (isRunning) return
                setSelectedPhase(phase.id)
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      <main className="min-h-0 flex-1 overflow-auto">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </main>
    </>
  )
}

function ExecutionLabel({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon
  label: ReactNode
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={20} className="stroke-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2 font-semibold capitalize">
        {value}
      </div>
    </div>
  )
}
