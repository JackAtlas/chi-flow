'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'

export async function GetCredentialsForUser() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  return prisma.credential.findMany({
    where: { userId },
    orderBy: {
      name: 'asc'
    }
  })
}
