import { getCreditsPack, PackId } from '@/types/billing'
import 'server-only'
import Stripe from 'stripe'
import prisma from '../prisma'

export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error('No metadata found in checkout session')
  }
  const { userId, packId } = event.metadata
  if (!userId) {
    throw new Error('No user id found in checkout session')
  }

  if (!packId) {
    throw new Error('No pack id found in checkout session')
  }

  const purchasePack = getCreditsPack(packId as PackId)
  if (!purchasePack) {
    throw new Error('Purchased pack not found')
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasePack.credits
    },
    update: {
      credits: {
        increment: purchasePack.credits
      }
    }
  })
}
