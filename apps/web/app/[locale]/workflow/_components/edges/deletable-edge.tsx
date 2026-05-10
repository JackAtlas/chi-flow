'use client'

import { Button } from '@workspace/ui/components/button'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps
} from '@xyflow/react'
import { XIcon } from 'lucide-react'

export default function DeletableEdge(props: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props)
  const { setEdges } = useReactFlow()

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-auto absolute leading-0"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="flex size-5 cursor-pointer rounded-full border hover:shadow-lg"
            onClick={() => {
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id))
            }}
          >
            <XIcon className="size-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
