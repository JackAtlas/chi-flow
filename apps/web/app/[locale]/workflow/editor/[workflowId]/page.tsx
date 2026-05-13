import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import Editor from '@/app/[locale]/workflow/_components/editor'
import { getTranslations } from 'next-intl/server'

export default async function WorkflowEditorPage({
  params
}: {
  params: Promise<{ workflowId: string }>
}) {
  const t = await getTranslations('Workflow.editor.empty')

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
      <div className="flex flex-1 items-center justify-center px-6">
        <div>
          {t('prefix')}
          <span className="text-primary">{workflowId}</span>
          {t('midfix')}
          <span className="text-primary">{username}</span>
          {t('suffix')}
        </div>
      </div>
    )
  }

  return <Editor workflow={workflow} />
}
