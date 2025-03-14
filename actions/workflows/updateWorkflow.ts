'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { WorkflowStatus, WorkflowStatusText } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function UpdateWorkflow({
  id,
  definition
}: {
  id: string
  definition: string
}) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId
    }
  })

  if (!workflow) throw new Error(WorkflowStatusText.NOT_FOUND)
  if (workflow.status !== WorkflowStatus.DRAFT)
    throw new Error(WorkflowStatusText.NOT_DRAFT)

  await prisma.workflow.update({
    where: {
      id,
      userId
    },
    data: {
      definition
    }
  })

  revalidatePath('/workflows')
}
