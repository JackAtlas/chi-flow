'use client'

import type { GetWorkflowExecutionStats } from '@/lib/analytics'
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
import { Layers2Icon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>

const chartConfig = {
  success: {
    label: 'Success',
    color: 'hsl(var(--chart-3))'
  },
  failed: {
    label: 'Failed',
    color: 'hsl(var(--chart-2))'
  }
}

export default function ExecutionStatusChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Layers2Icon className="size-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Daily number of successfull and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-50 w-full">
          <AreaChart
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
                return date.toLocaleDateString('zh', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Area
              min={0}
              type="bump"
              fillOpacity={0.6}
              fill="var(--chart-3)"
              stroke="var(--chart-3)"
              stackId="a"
              dataKey="success"
            />
            <Area
              min={0}
              type="bump"
              fillOpacity={0.6}
              fill="var(--chart-2)"
              stroke="var(--chart-2)"
              stackId="a"
              dataKey="failed"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
