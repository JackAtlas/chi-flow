import { Workflow } from '@/generated/prisma/client'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type ReactFlowJsonObject
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/node-component'
import { useEffect } from 'react'

const nodeTypes = {
  Node: NodeComponent
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const { setViewport } = useReactFlow()
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition) as ReactFlowJsonObject<
        Node,
        Edge
      >
      if (!flow) return
      setEdges(flow.edges || [])
      setNodes(flow.nodes || [])
      if (!flow.viewport) return
      const { x = 0, y = 0, zoom = 1 } = flow.viewport
      setViewport({ x, y, zoom })
    } catch (error) {
      console.error(error)
    }
  }, [workflow.definition, setEdges, setNodes, setViewport])

  return (
    <main className="h-full w-full">
      <ReactFlow
        edges={edges}
        nodes={nodes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
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
