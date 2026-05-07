'use server'

import { headers } from 'next/headers'
import { auth } from './auth/auth'
import prisma from './prisma'
import type { Period } from '@/types/analytics'
import { PeriodToDateRange } from './helpers/dates'
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow'
import { eachDayOfInterval, format } from 'date-fns'

type Stats = Record<
  string,
  {
    success: number
    failed: number
  }
>

const { COMPLETED, FAILED } = WorkflowExecutionStatus

export async function GetPeriods() {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const years = await prisma.workflowExecution.aggregate({
    where: { userId },
    _min: { startedAt: true }
  })

  const currentYear = new Date().getFullYear()

  const minYear = years._min.startedAt
    ? years._min.startedAt.getFullYear()
    : currentYear

  const periods: Period[] = []

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month })
    }
  }

  return periods
}

export async function GetStatsCardsValues(period: Period) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const dateRange = PeriodToDateRange(period)
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: { gte: dateRange.startDate, lte: dateRange.endDate },
      status: {
        in: [COMPLETED, FAILED]
      }
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: { not: null }
        },
        select: { creditsConsumed: true }
      }
    }
  })

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0
  }

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + execution.creditsConsumed,
    0
  )

  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  )

  return stats
}

export async function GetWorkflowExecutionStats(period: Period) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const dateRange = PeriodToDateRange(period)
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      }
    }
  })

  const dateFormat = 'yyyy-MM-dd'

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0
      }
      return acc
    }, {} as Stats)

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat)
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      if (stats[date]) stats[date].success += 1
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      if (stats[date]) stats[date].failed += 1
    }
  })

  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info
  }))

  return result
}

export async function GetCreditsUsageIntPeriod(period: Period) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const dateRange = PeriodToDateRange(period)
  const executionPhases = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      },
      status: {
        in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED]
      }
    }
  })

  const dateFormat = 'yyyy-MM-dd'

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0
      }
      return acc
    }, {} as Stats)

  executionPhases.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat)
    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      if (stats[date]) stats[date].success += phase.creditsConsumed
    }
    if (phase.status === ExecutionPhaseStatus.FAILED) {
      if (stats[date]) stats[date].failed += phase.creditsConsumed
    }
  })

  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info
  }))

  return result
}
