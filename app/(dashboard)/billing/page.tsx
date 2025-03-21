import { GetAvailableCredits } from '@/actions/billing/getAvailableCredits'
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeftRightIcon, CoinsIcon } from 'lucide-react'
import { Suspense } from 'react'
import CreditsPurchase from './_components/CreditsPurchase'
import { Period } from '@/types/analytics'
import { GetCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'
import CreditUsageChart from './_components/CreditUsageChart'
import { GetUserPurchaseHistory } from '@/actions/billing/getUserPurchaseHistory'
import InvoiceBtn from './_components/InvoiceBtn'

export default function BillingPage() {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  )
}

async function BalanceCard() {
  const userBalance = await GetAvailableCredits()
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg relative flex justify-between flex-col overflow-hidden">
      <CardContent className="px-6 items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              可用额度
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        额度用完后，您的工作流将停止运行。
      </CardFooter>
    </Card>
  )
}

async function CreditsUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }
  const data = await GetCreditsUsageInPeriod(period)
  return (
    <CreditUsageChart
      data={data}
      title="已用额度"
      description="本月每日使用的额度统计"
    />
  )
}

async function TransactionHistoryCard() {
  const purchase = await GetUserPurchaseHistory()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRightIcon className="h-6 w-6 text-primary" />
          交易记录
        </CardTitle>
        <CardDescription>查看你的交易记录，下载发票</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchase.map((purchase) => (
          <div
            key={purchase.id}
            className="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div>
              <p>{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmout(purchase.amount, purchase.currency)}
              </p>
              <InvoiceBtn id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

function formatAmout(amount: number, currency: string) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency
  }).format(amount / 100)
}
