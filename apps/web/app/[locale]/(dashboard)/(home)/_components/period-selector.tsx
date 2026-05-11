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
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'

export default function PeriodSelector({
  periods,
  selectedPeriod
}: {
  periods: Period[]
  selectedPeriod: Period
}) {
  const router = useRouter()
  const locale = useLocale()
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
            {new Intl.DateTimeFormat(locale, {
              year: 'numeric',
              month: 'short'
            }).format(new Date(period.year, period.month))}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
