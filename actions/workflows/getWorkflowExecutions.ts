'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'

export async function GetWorkflowExecutions(workflowId: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
