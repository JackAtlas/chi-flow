'use server'

import prisma from '@/lib/prisma'
import { FlowToExecutionPlan } from '@/lib/workflow/executionPlan'
import { AuthErrorText } from '@/types/auth'
import {
  WorkflowExecutionPlan,
  WorkflowRunResultText
} from '@/types/workflow'
import { auth } from '@clerk/nextjs/server'

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
}
