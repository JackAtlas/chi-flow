import { Workflow } from '@/generated/prisma/client'
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  getOutgoers,
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
import { TaskRegistry } from '@/lib/workflow/task/registry'

const nodeTypes = {
  Node: NodeComponent
}

const edgeTypes = {
  default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const { screenToFlowPosition, setViewport, updateNodeData } = useReactFlow()
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
      if (!connection.targetHandle) return

      const node = nodes.find((nd) => nd.id === connection.target)
      if (!node) return
      const nodeInputs = node.data.inputs
      delete nodeInputs[connection.targetHandle]
      updateNodeData(node.id, { inputs: nodeInputs })
    },
    [nodes, setEdges, updateNodeData]
  )

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No self-connection allowed
      if (connection.source === connection.target) return false

      // Same taskParam type connection
      const source = nodes.find((node) => node.id === connection.source)
      const target = nodes.find((node) => node.id === connection.target)
      if (!source || !target) {
        console.warn('Invalid connection: source or target node not found')
        return false
      }

      const sourceTask = TaskRegistry[source.data.type]
      const targetTask = TaskRegistry[target.data.type]

      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      )

      const input = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle
      )

      if (input?.type !== output?.type || input?.name !== output?.name) {
        console.warn('Invalid connection: type mismatch')
        return false
      }

      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false
        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }
      }

      const detectedCycle = hasCycle(target)
      return !detectedCycle
    },
    [nodes, edges]
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
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}
