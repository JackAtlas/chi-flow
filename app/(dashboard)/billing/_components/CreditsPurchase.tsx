'use client'

import { PurchaseCredits } from '@/actions/billing/purchaseCredits'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group'
import { CreditsPack, PackId } from '@/types/billing'
import { useMutation } from '@tanstack/react-query'
import { CoinsIcon, CreditCard } from 'lucide-react'
import React, { useState } from 'react'

export default function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState<PackId>(
    PackId.SMALL
  )
  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {},
    onError: () => {}
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon />
          购买额度
        </CardTitle>
        <CardDescription>选择您要购买的额度包</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPack.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex justify-between w-full cursor-pointer">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ￥{(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => {
            // mutation.mutate(selectedPack)
          }}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          付款（这是个假按钮）
        </Button>
      </CardFooter>
    </Card>
  )
}
