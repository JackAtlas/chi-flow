import { getAppUrl } from '@/lib/helpers/appUrl'
import prisma from '@/lib/prisma'
import { WorkflowStatus } from '@/types/workflow'
import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date()
  const workflows = await prisma.workflow.findMany({
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now }
    },
    select: { id: true }
  })

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id)
  }

  return NextResponse.json(
    { workflows, workflowsToRun: workflows.length },
    { status: 200 }
  )
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  )

  fetch(triggerApiUrl, {
    headers: {
      authorization: `Bearer ${process.env.API_SECRET!}`
    },
    cache: 'no-store'
  }).catch((error) => {
    console.error(
      'Error triggering workflow with id',
      workflowId,
      ':error->',
      error.message
    )
  })
}
