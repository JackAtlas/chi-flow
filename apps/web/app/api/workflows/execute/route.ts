import prisma from '@/lib/prisma'
import { ExecuteWorkflow } from '@/lib/workflow/execute-workflow'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  type WorkflowExecutionPlan
} from '@/types/workflow'
import { NextResponse, type NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { CronExpressionParser } from 'cron-parser'

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET
  if (!API_SECRET) return false

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = authHeader.split(' ')[1] || ''
  if (!isValidSecret(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const workflowId = searchParams.get('workflowId') as string

  if (!workflowId) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId }
  })

  if (!workflow || !workflow.executionPlan) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan
  ) as WorkflowExecutionPlan

  try {
    const cron = CronExpressionParser.parse(workflow.cron!)
    const nextRun = cron.next().toDate()

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label
              }
            })
          })
        }
      }
    })

    await ExecuteWorkflow(execution.id, nextRun)
    return new NextResponse(null, { status: 200 })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
