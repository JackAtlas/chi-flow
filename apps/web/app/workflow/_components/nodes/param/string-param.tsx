'use client'

import { ParamProps } from '@/types/appNode'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { useEffect, useId, useState } from 'react'

export default function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled
}: ParamProps) {
  const [internalValue, setInternalValue] = useState(value)
  const id = useId()

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  let Component: any = Input
  if (param.variant === 'textarea') {
    Component = Textarea
  }

  return (
    <div className="w-full space-y-1 p-1">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="px-2 text-red-400">*</p>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        value={internalValue}
        className="border-primary"
        placeholder="Enter value here"
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="px-2 text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  )
}
