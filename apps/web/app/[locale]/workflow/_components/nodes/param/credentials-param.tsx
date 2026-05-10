'use client'

import { GetCredentialsForUser } from '@/lib/credentials'
import type { ParamProps } from '@/types/appNode'
import { useQuery } from '@tanstack/react-query'
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

export default function CredentialsParam({
  param,
  updateNodeParamValue,
  value
}: ParamProps) {
  const id = useId()
  const query = useQuery({
    queryKey: ['credentials-for-user'],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000
  })
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
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
