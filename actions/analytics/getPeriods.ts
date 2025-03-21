'use server'

import prisma from '@/lib/prisma'
import { Period } from '@/types/analytics'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'

export async function GetPeriods() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const years = await prisma.workflowExecution.aggregate({
    where: { userId },
    _min: { startedAt: true }
  })

  const currentYears = new Date().getFullYear()

  const minYear = years._min.startedAt?.getFullYear() ?? currentYears

  const periods: Period[] = []

  for (let year = minYear; year <= currentYears; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month })
    }
  }

  return periods
}
