import prisma from '@/lib/prisma'
import { AuthErrorText } from '@/types/auth'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import Editor from '../../_components/Editor'

async function page({
  params
}: {
  params: Promise<{ workflowId: string }>
}) {
  const { workflowId } = await params
  const { userId } = await auth()
  if (!userId) return <div>{AuthErrorText.UNAUTHENTICATED}</div>

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  })

  if (!workflow) return <div>Workflow not found</div>

  return <Editor workflow={workflow} />
}

export default page
