'use client'

import { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@workspace/ui/components/tooltip'

interface Props {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export default function TooltipWrapper(props: Props) {
  if (!props.content) return props.children
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
