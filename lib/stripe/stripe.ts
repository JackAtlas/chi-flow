import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIKE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true
})
