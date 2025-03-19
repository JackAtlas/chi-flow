'use server'

import prisma from '@/lib/prisma'
import { FlowToExecutionPlan } from '@/lib/workflow/executionPlan'
import { CalculateWorkflowCost } from '@/lib/workflow/helpers'
import { AuthErrorText } from '@/types/auth'
import { WorkflowStatus } from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function PublishWorkflow({
  id,
  flowDefinition
}: {
  id: string
  flowDefinition: string
}) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId
    }
  })

  if (!workflow) {
    throw new Error('Workflow not found')
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not in draft status')
  }

  const flow = JSON.parse(flowDefinition)
  const result = FlowToExecutionPlan(flow.nodes, flow.edges)
  if (result.error) {
    throw new Error('Invalid workflow definition')
  }

  if (!result.executionPlan) {
    throw new Error('no execution plan generated')
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes)

  await prisma.workflow.update({
    where: {
      id,
      userId
    },
    data: {
      status: WorkflowStatus.PUBLISHED,
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost
    }
  })

  revalidatePath(`/workflow/editor/${id}`)
}
