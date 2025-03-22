import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError
} from '@/lib/workflow/executionPlan'
import { AppNode } from '@/types/appNode'
import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import useFlowValidation from './useFlowValidation'
import { toast } from 'sonner'

const useExecutionPlan = () => {
  const { toObject } = useReactFlow()

  const { setInvalidInputs, clearErrors } = useFlowValidation()

  const handleError = useCallback(
    // eslint-disable-next-line
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error('缺少起始点')
          break
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error('存在缺值的输入框')
          setInvalidInputs(error.invalidElements)
          break
        default:
          toast.error('未知错误')
      }
    },
    [setInvalidInputs]
  )

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject()
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    )

    if (error) {
      handleError(error)
      return null
    }

    clearErrors()

    return executionPlan
  }, [toObject, handleError, clearErrors])

  return generateExecutionPlan
}

export default useExecutionPlan
