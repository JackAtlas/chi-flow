'use client'

import type { ParamProps } from '@/types/appNode'
import { Label } from '@workspace/ui/components/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select'
import { useId } from 'react'

type OptionType = {
  label: string
  value: string
}

export default function SelectParam({
  param,
  updateNodeParamValue,
  value
}: ParamProps) {
  const id = useId()
  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="p-2 text-red-400">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
