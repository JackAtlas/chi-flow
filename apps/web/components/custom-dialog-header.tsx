'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog'
import { cn } from '@workspace/ui/lib/utils'
import { LucideIcon } from 'lucide-react'

interface Props {
  title?: string
  subTitle?: string
  icon?: LucideIcon

  titleClassNames?: string
  subtitleClassNames?: string
  iconClassNames?: string
}

export default function CustomDialogHeader(props: Props) {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="mb-2 flex flex-col items-center gap-2">
          {props.icon && (
            <props.icon
              size={30}
              className={cn('stroke-primary', props.iconClassNames)}
            />
          )}
          {props.title && (
            <p className={cn('text-xl text-primary', props.titleClassNames)}>
              {props.title}
            </p>
          )}
        </div>
      </DialogTitle>
      {props.subTitle && (
        <DialogDescription
          className={cn(
            'text-sm text-muted-foreground',
            props.subtitleClassNames
          )}
        >
          {props.subTitle}
        </DialogDescription>
      )}
    </DialogHeader>
  )
}
