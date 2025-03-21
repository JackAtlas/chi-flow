import { HandleCheckoutSessionCompleted } from '@/lib/stripe/handleCheckoutSessionCompleted'
import { stripe } from '@/lib/stripe/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.text()
  const headerList = await headers()
  const signature = headerList.get('stripe-signature') as string

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )

    switch (event.type) {
      case 'checkout.session.completed':
        HandleCheckoutSessionCompleted(event.data.object)
        break
      default:
        break
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.log('stripe webhook error', error)
    return new NextResponse('stripe webhook error', { status: 400 })
  }
}
