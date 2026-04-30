import { Workflow } from '@/generated/prisma/client'
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type ReactFlowJsonObject
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/node-component'
import { useCallback, useEffect, type DragEvent } from 'react'
import type { AppNode } from '@/types/appNode'
import { CreateFlowNode } from '@/lib/workflow/node'
import type { TaskType } from '@/types/task'
import DeletableEdge from './edges/deletable-edge'

const nodeTypes = {
  Node: NodeComponent
}

const edgeTypes = {
  default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const { screenToFlowPosition, setViewport } = useReactFlow()
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition) as ReactFlowJsonObject<
        AppNode,
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

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const taskType = event.dataTransfer.getData('application/reactflow')
      if (typeof taskType === 'undefined' || !taskType) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      const newNode = CreateFlowNode(taskType as TaskType, position)
      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
    },
    [setEdges]
  )

  return (
    <main className="h-full w-full">
      <ReactFlow
        edges={edges}
        nodes={nodes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitViewOptions={fitViewOptions}
        snapToGrid
        snapGrid={snapGrid}
        proOptions={{ hideAttribution: true }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}
