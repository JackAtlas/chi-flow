'use server'

import { headers } from 'next/headers'
import { auth } from './auth/auth'
import prisma from './prisma'
import {
  createCredentialSchema,
  type createCredentialSchemaType
} from '@/schema/credential'
import { symmetricEncrypt } from './encryption'
import { revalidatePath } from 'next/cache'

export async function GetCredentialsForUser() {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  return prisma.credential.findMany({
    where: { userId },
    orderBy: {
      name: 'asc'
    }
  })
}

export async function CreateCredential(form: createCredentialSchemaType) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const { success, data } = createCredentialSchema.safeParse(form)

  if (!success) throw new Error('Invalid form data')

  const encryptedValue = symmetricEncrypt(data.value)

  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue
    }
  })

  if (!result) {
    throw new Error('Failed to create credential')
  }
}

export async function DeleteCredential(name: string) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  await prisma.credential.delete({
    where: {
      userId_name: { userId, name }
    }
  })

  revalidatePath('/credentials')
}
