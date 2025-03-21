'use server'

import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function DeleteCredential(name: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  await prisma.credential.delete({
    where: {
      userId_name: {
        userId,
        name
      }
    }
  })

  revalidatePath('/credentials')
}
