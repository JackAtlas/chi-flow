'use client'

import type { GetCreditsUsageIntPeriod } from '@/lib/analytics'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@workspace/ui/components/chart'
import { ChartColumnStackedIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageIntPeriod>>

export default function CreditsUsageChart({
  data,
  description,
  title
}: {
  data: ChartData
  description: string
  title: string
}) {
  const locale = useLocale()
  const t = useTranslations('Static.credits')
  const chartConfig = {
    success: {
      label: t('key.success'),
      color: 'hsl(var(--chart-3))'
    },
    failed: {
      label: t('key.failed'),
      color: 'hsl(var(--chart-2))'
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ChartColumnStackedIcon className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-50 w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString(locale, {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              fill="var(--chart-3)"
              stroke="var(--chart-3)"
              stackId="a"
              dataKey="success"
            />
            <Bar
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              fill="var(--chart-2)"
              stroke="var(--chart-2)"
              stackId="a"
              dataKey="failed"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
