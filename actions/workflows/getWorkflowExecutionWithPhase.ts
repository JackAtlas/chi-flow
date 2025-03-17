'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'

export async function GetWorkflowExecutionWithPhase(
  executionId: string
) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId
    },
    include: {
      phases: {
        orderBy: {
          number: 'asc'
        }
      }
    }
  })
}
