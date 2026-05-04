'use client'

import { Workflow } from '@/generated/prisma/client'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flow-editor'
import Topbar from './topbar/topbar'
import TaskMenu from './task-menu'
import { FlowValidationContextProvider } from '@/components/context/flow-validation-context'
import { WorkflowStatus } from '@/types/workflow'

export default function Editor({ workflow }: { workflow: Workflow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subTitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}
