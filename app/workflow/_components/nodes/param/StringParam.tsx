'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ParamProps } from '@/types/appNode'
import { useEffect, useId, useState } from 'react'

function StringParam({
  param,
  value = '',
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
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.text}
        {param.required && <p className="text-red-400">*</p>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        className="text-xs"
        value={internalValue}
        placeholder="请输入"
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground">
          {param.helperText}
        </p>
      )}
    </div>
  )
}

export default StringParam
