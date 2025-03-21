'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function SetupUser() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const balance = await prisma.userBalance.findUnique({
    where: { userId }
  })
  if (!balance) {
    await prisma.userBalance.create({
      data: { userId, credits: 10000 }
    })
  }

  return redirect('/')
}
