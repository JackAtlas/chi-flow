'use client'

import { PurchaseCredits } from '@/lib/billing'
import { CreditsPack, PackId } from '@/types/billing'
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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM)
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {
      toast.success('Successfully purchased', { id: 'purchase credits' })
      router.refresh()
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'purchase credits' })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <CoinsIcon className="size-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPack.map((pack) => (
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
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate(selectedPack)
          }}
        >
          <CreditCardIcon className="mr-2 size-5" />
          Purchase credits
        </Button>
      </CardFooter>
    </Card>
  )
}
