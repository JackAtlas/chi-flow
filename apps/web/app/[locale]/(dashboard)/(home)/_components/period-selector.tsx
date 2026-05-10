'use client'

import { useRouter } from '@/i18n/navigation'
import type { Period } from '@/types/analytics'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select'
import { useSearchParams } from 'next/navigation'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

export default function PeriodSelector({
  periods,
  selectedPeriod
}: {
  periods: Period[]
  selectedPeriod: Period
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split('-')
        const params = new URLSearchParams(searchParams)
        params.set('month', month || '')
        params.set('year', year || '')
        router.push(`?${params.toString()}`)
      }}
    >
      <SelectTrigger className="w-45">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {MONTH_NAMES[period.month]} {period.year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
