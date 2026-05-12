'use client'

import { useRouter } from '@/i18n/navigation'
import { PurchaseCredits } from '@/lib/billing'
import { CreditsPack, PackId, TranslatedCreditsPack } from '@/types/billing'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import { Label } from '@workspace/ui/components/label'
import {
  RadioGroup,
  RadioGroupItem
} from '@workspace/ui/components/radio-group'
import { CoinsIcon, CreditCardIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CreditsPurchase() {
  const locale = useLocale()
  const t = useTranslations('Billing')
  const m = useTranslations('Messages')

  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM)
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {
      toast.success(t('messages.success'), { id: 'purchase credits' })
      router.refresh()
    },
    onError: () => {
      toast.error(m('Common.Error.later'), { id: 'purchase credits' })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <CoinsIcon className="size-6 text-primary" />
          {t('purchase.title')}
        </CardTitle>
        <CardDescription>{t('purchase.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPack.map((pack) => {
            const name =
              locale === 'en'
                ? pack.name
                : TranslatedCreditsPack[locale]?.[pack.id]
            return (
              <Label
                className="flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-secondary/50 p-3 hover:bg-secondary"
                key={pack.id}
              >
                <RadioGroupItem
                  value={pack.id}
                  id={pack.id}
                  className="bg-background"
                />
                <div className="flex flex-1 justify-between">
                  <span className="font-medium">
                    {name} - {pack.credits} {t('purchase.label')}
                  </span>
                  <span className="font-bold text-primary">
                    ${(pack.price / 100).toFixed(2)}
                  </span>
                </div>
              </Label>
            )
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate({ packId: selectedPack, locale })
          }}
        >
          <CreditCardIcon className="mr-2 size-5" />
          {t('purchase.button')}
        </Button>
      </CardFooter>
    </Card>
  )
}
