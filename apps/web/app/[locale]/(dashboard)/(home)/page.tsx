import {
  GetCreditsUsageIntPeriod,
  GetPeriods,
  GetStatsCardsValues,
  GetWorkflowExecutionStats
} from '@/lib/analytics'
import { Suspense } from 'react'
import PeriodSelector from './_components/period-selector'
import type { Period } from '@/types/analytics'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react'
import StatsCard from './_components/stats-card'
import ExecutionStatusChart from './_components/execution-status-chart'
import CreditsUsageChart from '../billing/_components/credits-usage-chart'

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const currentDate = new Date()
  const { month, year } = await searchParams
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear()
  }
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex justify-between px-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="h-5 w-45" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-6 p-6">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-75 w-full" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-75 w-full" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectorWrapper({
  selectedPeriod
}: {
  selectedPeriod: Period
}) {
  const periods = await GetPeriods()
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValues(selectedPeriod)
  return (
    <div className="grid min-h-30 gap-3 lg:grid-cols-3 lg:gap-8">
      <StatsCard
        title="Workflow executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-3 lg:gap-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="min-h-30 w-full" />
      ))}
    </div>
  )
}

async function StatsExecutionStatus({
  selectedPeriod
}: {
  selectedPeriod: Period
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod)
  return <ExecutionStatusChart data={data} />
}

async function CreditsUsageInPeriod({
  selectedPeriod
}: {
  selectedPeriod: Period
}) {
  const data = await GetCreditsUsageIntPeriod(selectedPeriod)
  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credit consumed in selected period"
    />
  )
}
