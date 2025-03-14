'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ParamProps } from '@/types/appNode'
import { useId, useState } from 'react'

function StringParam({
  param,
  value,
  updateNodeParamValue
}: ParamProps) {
  const [internalValue, setInternalValue] = useState(value)
  const id = useId()
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.text}
        {param.required && <p className="text-red-400">*</p>}
      </Label>
      <Input
        id={id}
        className="text-xs"
        value={internalValue}
        placeholder="请输入"
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
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
