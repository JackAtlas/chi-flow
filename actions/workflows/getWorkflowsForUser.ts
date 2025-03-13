'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'

export async function GetWorkflowsForUser() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  return prisma.workflow.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}
