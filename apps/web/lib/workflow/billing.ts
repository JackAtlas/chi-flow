'use server'

import { headers } from 'next/headers'
import { auth } from '../auth/auth'
import prisma from '../prisma'

export async function GetAvailableCredits() {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const balance = await prisma.userBalance.findUnique({
    where: { userId }
  })

  if (!balance) return -1
  return balance.credits
}
