'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'

export async function GetAvailableCredits() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const balance = await prisma.userBalance.findUnique({
    where: { userId }
  })
  if (!balance) return 100
  return balance.credits
}
