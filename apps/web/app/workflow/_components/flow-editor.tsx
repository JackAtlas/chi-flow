import { Workflow } from '@/generated/prisma/client'
import { CreateFlowNode } from '@/lib/workflow/node'
import { TaskType } from '@/types/task'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/node-component'

const nodeTypes = {
  Node: NodeComponent
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    CreateFlowNode(TaskType.LAUNCH_BROWSER)
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  return (
    <main className="h-full w-full">
      <ReactFlow
        edges={edges}
        nodes={nodes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        snapToGrid
        snapGrid={snapGrid}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}
