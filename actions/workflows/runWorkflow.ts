'use server'

import prisma from '@/lib/prisma'
import { ExecuteWorkflow } from '@/lib/workflow/executeWorkflow'
import { FlowToExecutionPlan } from '@/lib/workflow/executionPlan'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { AuthErrorText } from '@/types/auth'
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowRunResultText
} from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function RunWorkflow(form: {
  workflowId: string
  flowDefinition?: string
}) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error(AuthErrorText.UNAUTHENTICATED)
  }

  const { workflowId, flowDefinition } = form
  if (!workflowId) {
    throw new Error(WorkflowRunResultText.ID)
  }
  if (!flowDefinition) {
    throw new Error(WorkflowRunResultText.NO_DEFINITION)
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId
    }
  })

  if (!workflow) {
    throw new Error(WorkflowRunResultText.NOT_FOUND)
  }

  let executionPlan: WorkflowExecutionPlan
  const flow = JSON.parse(flowDefinition)
  const result = FlowToExecutionPlan(flow.nodes, flow.edges)
  if (result.error) {
    throw new Error(WorkflowRunResultText.INVALID_DEFINITION)
  }

  if (!result.executionPlan) {
    throw new Error(WorkflowRunResultText.NO_EXECUTION_PLAN)
  }

  executionPlan = result.executionPlan

  const execution = await prisma.workflowExecution.create({
    data: {
      userId,
      workflowId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
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
    throw new Error('workflow execution not created')
  }

  ExecuteWorkflow(execution.id)

  redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}
