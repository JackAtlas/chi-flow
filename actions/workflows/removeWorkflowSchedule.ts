'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function RemoveWorkflowSchedule(id: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  await prisma.workflow.update({
    where: {
      id,
      userId
    },
    data: {
      cron: null,
      nextRunAt: null
    }
  })

  revalidatePath('/workflows')
}
