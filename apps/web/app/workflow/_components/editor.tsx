'use client'

import { Workflow } from '@/generated/prisma/client'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flow-editor'
import Topbar from './topbar/topbar'
import TaskMenu from './task-menu'

export default function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Topbar
          title="Workflow Editor"
          subTitle={workflow.name}
          workflowId={workflow.id}
        />
        <section className="flex h-full overflow-auto">
          <TaskMenu />
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  )
}
