'use server'

import { headers } from 'next/headers'
import { auth } from '../auth/auth'
import prisma from '../prisma'
import { createWorkflowSchema, CreateWorkflowSchema } from '@/schema/workflow'
import { WorkflowStatus, type WorkflowExecutionPlan } from '@/types/workflow'
import { redirect } from 'next/navigation'
import type { AppNode } from '@/types/appNode'
import type { Edge } from '@xyflow/react'
import { CreateFlowNode } from './node'
import { TaskType } from '@/types/task'
import { FlowToExecutionPlan } from './execution-plan'

export async function getWorkflowsForUser() {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  return prisma.workflow.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
}

export async function createWorkflow(form: CreateWorkflowSchema) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const { success, data } = createWorkflowSchema.safeParse(form)

  if (!success) throw new Error('Invalid form data')

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: []
  }

  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

  const result = await prisma.workflow.create({
    data: {
      name: data.name,
      description: data.description,
      definition: JSON.stringify(initialFlow),
      status: WorkflowStatus.DRAFT,
      userId
    }
  })

  if (!result) {
    throw new Error('Failed to create workflow')
  }

  redirect(`/workflow/editor/${result.id}`)
}

export async function DeleteWorkflow(workflowId: string) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  await prisma.workflow.delete({
    where: { id: workflowId, userId }
  })
}

export async function UpdateWorkflow({
  id,
  definition
}: {
  id: string
  definition: string
}) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId }
  })

  if (!workflow) throw new Error('workflow not found')
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('workflow is not a draft')
  }

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      definition
    }
  })
}

export async function RunWorkflow(form: {
  workflowId: string
  flowDefinition?: string
}) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const { workflowId, flowDefinition } = form
  if (!workflowId) {
    throw new Error('WorkflowId is required')
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId }
  })

  let executionPlan: WorkflowExecutionPlan
  if (!flowDefinition) {
    throw new Error('flow definition is not defined')
  }

  const flow = JSON.parse(flowDefinition)
  const result = FlowToExecutionPlan(flow.nodes, flow.edges)
  if (result.error || !result.executionPlan) {
    throw new Error('flow definition is not valid')
  }

  executionPlan = result.executionPlan
  console.log('execution plan', executionPlan)
}
