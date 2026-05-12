import { GetAvailableCredits } from '@/lib/workflow/billing'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Suspense } from 'react'
import BalanceCardCountUp from './_components/balance-card-count-up'
import { AlertCircleIcon, ArrowLeftRightIcon, CoinsIcon } from 'lucide-react'
import CreditsPurchase from './_components/credits-purchase'
import type { Period } from '@/types/analytics'
import { GetCreditsUsageIntPeriod } from '@/lib/analytics'
import CreditsUsageChart from './_components/credits-usage-chart'
import { GetUserPurchaseHistory } from '@/lib/billing'
import { Button } from '@workspace/ui/components/button'
import TooltipWrapper from '@/components/TooltipWrapper'
import { getLocale, getTranslations } from 'next-intl/server'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@workspace/ui/components/alert'

export default async function BillingPage() {
  const t = await getTranslations('Billing')

  return (
    <div className="flex flex-col gap-6 px-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>{t('alert.title')}</AlertTitle>
        <AlertDescription>
          {t.rich('alert.desc', {
            strong: (chunk) => <strong>{chunk}</strong>
          })}
        </AlertDescription>
      </Alert>

      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <BalanceCard />
      </Suspense>

      <CreditsPurchase />

      <Suspense fallback={<Skeleton className="h-75 w-full" />}>
        <CreditUsageCard />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-75 w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  )
}

async function BalanceCard() {
  const t = await getTranslations('Billing.balance')

  const userBalance = await GetAvailableCredits()
  return (
    <Card className="flex flex-col justify-between border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-background shadow-lg">
      <CardContent className="relative items-center">
        <div className="flex items-center justify-between">
          <h3 className="mb-1 text-lg font-semibold text-foreground">
            {t('title')}
          </h3>
        </div>
        <p className="tex-4xl font-bold text-primary">
          <BalanceCardCountUp value={userBalance} />
        </p>

        <CoinsIcon
          size={140}
          className="absolute right-0 bottom-0 text-primary opacity-20"
        />
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {t('desc')}
      </CardFooter>
    </Card>
  )
}

async function CreditUsageCard() {
  const t = await getTranslations('Billing.usage')

  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }
  const data = await GetCreditsUsageIntPeriod(period)
  return (
    <CreditsUsageChart data={data} title={t('title')} description={t('desc')} />
  )
}

async function TransactionHistoryCard() {
  const locale = await getLocale()
  let dateLocale: string
  switch (locale) {
    case 'zh':
      dateLocale = 'zh-CN'
      break
    default:
      dateLocale = 'en-US'
  }
  const t = await getTranslations('Billing')

  const purchases = await GetUserPurchaseHistory()

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRightIcon className="size-6 text-primary" />
          {t('history.title')}
        </CardTitle>
        <CardDescription>{t('history.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">{t('history.empty')}</p>
        )}
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.title} - {purchase.credits} {t('purchase.label')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <TooltipWrapper content={t('history.fake')}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer gap-2 text-xs text-muted-foreground"
                >
                  {t('history.invoice')}
                </Button>
              </TooltipWrapper>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount / 100)
}
