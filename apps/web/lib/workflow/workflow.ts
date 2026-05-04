'use server'

import { headers } from 'next/headers'
import { auth } from '../auth/auth'
import prisma from '../prisma'
import { createWorkflowSchema, CreateWorkflowSchema } from '@/schema/workflow'
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
  type WorkflowExecutionPlan
} from '@/types/workflow'
import { redirect } from 'next/navigation'
import type { AppNode } from '@/types/appNode'
import type { Edge } from '@xyflow/react'
import { CreateFlowNode } from './node'
import { TaskType } from '@/types/task'
import { FlowToExecutionPlan } from './execution-plan'
import { TaskRegistry } from './task/registry'
import { ExecuteWorkflow } from './execute-workflow'
import { CalculateWorkflowCost } from './helpers'

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

  if (!workflow) throw new Error('Workflow not found')

  let executionPlan: WorkflowExecutionPlan
  let workflowDefinition
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error('No execution plan found in published workflow')
    }
    executionPlan = JSON.parse(workflow.executionPlan)
    workflowDefinition = workflow.definition
  } else {
    if (!flowDefinition) throw new Error('flow definition is not defined')
    const flow = JSON.parse(flowDefinition)
    const result = FlowToExecutionPlan(flow.nodes, flow.edges)
    if (result.error || !result.executionPlan) {
      throw new Error('flow definition is not valid')
    }
    executionPlan = result.executionPlan
    workflowDefinition = flowDefinition
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label
            }
          })
        })
      }
    },
    select: {
      id: true,
      phases: true
    }
  })

  if (!execution) {
    throw new Error('Workflow execution not created')
  }

  ExecuteWorkflow(execution.id)

  redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}

export async function GetWorkflowExecutions(workflowId: string) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  return prisma.workflowExecution.findMany({
    where: { workflowId, userId },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  return prisma.workflowExecution.findUnique({
    where: { id: executionId, userId },
    include: {
      phases: {
        orderBy: {
          number: 'asc'
        }
      }
    }
  })
}

export async function GetWorkflowPhaseDetails(phaseId: string) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId
      }
    },
    include: {
      logs: { orderBy: { timestamp: 'asc' } }
    }
  })
}

export async function PublishWorkflow({
  id,
  flowDefinition
}: {
  id: string
  flowDefinition: string
}) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId }
  })

  if (!workflow) throw new Error('Workflow not found')

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not a draft')
  }

  const flow = JSON.parse(flowDefinition)
  const result = FlowToExecutionPlan(flow.nodes, flow.edges)
  if (result.error) {
    throw new Error('Flow definition not valid')
  }

  if (!result.executionPlan) {
    throw new Error('No execution plan generated')
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes)
  await prisma.workflow.update({
    where: { id, userId },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED
    }
  })
}

export async function UnpublishWorkflow(id: string) {
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id

  if (!userId) throw new Error('Unauthenticated')

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId }
  })

  if (!workflow) throw new Error('Workflow not found')

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error('Workflow is not published')
  }

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0
    }
  })
}
