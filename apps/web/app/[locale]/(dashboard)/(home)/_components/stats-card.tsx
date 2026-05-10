import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import type { LucideIcon } from 'lucide-react'
import StatsCardCountUp from './stats-card-count-up'

interface Props {
  title: string
  value: number
  icon: LucideIcon
}

export default function StatsCard({ icon: Icon, title, value }: Props) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="absolute -right-8 -bottom-4 stroke-primary text-muted-foreground opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <StatsCardCountUp value={value} />
        </div>
      </CardContent>
    </Card>
  )
}
