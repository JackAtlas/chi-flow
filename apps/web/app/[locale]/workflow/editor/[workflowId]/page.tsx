import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import Editor from '@/app/[locale]/workflow/_components/editor'

export default async function WorkflowEditorPage({
  params
}: {
  params: Promise<{ workflowId: string }>
}) {
  const { workflowId } = await params
  const authData = await auth.api.getSession({
    headers: await headers()
  })
  const userId = authData?.user?.id
  const username = authData?.user?.name

  if (!userId) {
    return <div>Unauthenticated</div>
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId }
  })

  if (!workflow) {
    return (
      <div className="px-6">
        <div>
          Neither does the workflow(id:{' '}
          <span className="text-primary">{workflowId}</span>) exist for user{' '}
          <span className="text-primary">{username}</span>, nor does the user
          have permission to access it.
        </div>
      </div>
    )
  }

  return <Editor workflow={workflow} />
}
