'use server'

import prisma from '@/lib/prisma'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import {
  createWorkflowSchema,
  createWorkflowSchemaType
} from '@/schema/workflow'
import { AppNode } from '@/types/appNode'
import { AuthErrorText } from '@/types/auth'
import { TaskType } from '@/types/task'
import {
  WorkflowCreateResultText,
  WorkflowStatus
} from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { Edge } from '@xyflow/react'
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

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: []
  }

  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data
    }
  })

  if (!result) {
    throw new Error(WorkflowCreateResultText.CREATE_FAIL)
  }

  redirect(`/workflow/editor/${result.id}`)
}
