'use client'

import { GetWorkflowExecutionStatus } from '@/actions/analytics/getWorkflowExecutionStatus'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Layers2 } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

type ChartData = Awaited<
  ReturnType<typeof GetWorkflowExecutionStatus>
>

const chartConfig = {
  success: {
    label: 'Success',
    color: 'var(--chart-2)'
  },
  failed: {
    label: 'Failed',
    color: 'var(--chart-1)'
  }
}

export default function ExecutionStatusChart({
  data
}: {
  data: ChartData
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2 className="w-6 h-6 text-primary" />
          工作流运行统计
        </CardTitle>
        <CardDescription>
          每日工作流运行统计（包含运行成功和失败）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[200px] w-full"
        >
          <AreaChart data={data} height={200}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('zh-CN', {
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
              fill="var(--color-success)"
              fillOpacity={0.6}
              stroke="var(--color-success)"
              dataKey="success"
              stackId="a"
            />
            <Area
              min={0}
              type="bump"
              fill="var(--color-failed)"
              fillOpacity={0.6}
              stroke="var(--color-failed)"
              dataKey="failed"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
