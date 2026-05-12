'use server'

import { getCreditsPack, PackId, TranslatedCreditsPack } from '@/types/billing'
import { auth } from './auth/auth'
import { headers } from 'next/headers'
import prisma from './prisma'

export async function PurchaseCredits({
  locale,
  packId
}: {
  locale: string
  packId: PackId
}) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const selectedPack = getCreditsPack(packId)
  if (!selectedPack) throw new Error('Invalid pack')

  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: selectedPack.credits
    },
    update: {
      credits: {
        increment: selectedPack.credits
      }
    }
  })

  const name =
    TranslatedCreditsPack[locale]?.[selectedPack.id] || selectedPack.name

  await prisma.userPurchase.create({
    data: {
      userId,
      locale,
      title: name,
      credits: selectedPack.credits,
      description: `${selectedPack.name} - ${selectedPack.credits} credits`,
      amount: selectedPack.price,
      currency: 'usd'
    }
  })
}

export async function GetUserPurchaseHistory() {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  return prisma.userPurchase.findMany({
    where: { userId },
    orderBy: { date: 'desc' }
  })
}
