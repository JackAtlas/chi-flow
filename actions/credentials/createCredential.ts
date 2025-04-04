'use server'

import { symmetricEncrypt } from '@/lib/encryption'
import prisma from '@/lib/prisma'
import {
  createCredentialSchema,
  createCredentialSchemaType
} from '@/schema/credential'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function CreateCredential(
  form: createCredentialSchemaType
) {
  const { success, data } = createCredentialSchema.safeParse(form)
  if (!success) {
    throw new Error('Invalid form data')
  }

  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

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

  revalidatePath('/credentials')
}
