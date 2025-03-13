'use server'

import prisma from '@/lib/prisma'
import {
  createWorkflowSchema,
  createWorkflowSchemaType
} from '@/schema/workflow'
import { AuthErrorText } from '@/types/auth'
import {
  WorkflowCreateResultText,
  WorkflowStatus
} from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form)
  if (!success) {
    throw new Error('Invalid form data')
  }

  const { userId } = await auth()

  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: 'TODO',
      ...data
    }
  })

  if (!result) {
    throw new Error(WorkflowCreateResultText.CREATE_FAIL)
  }

  redirect(`/workflow/editor/${result.id}`)
}
