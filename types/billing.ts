export enum PackId {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

export type CreditsPack = {
  id: PackId
  name: string
  label: string
  credits: number
  price: number
  priceId: string
}

export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: '小额度包',
    label: '1,000 点',
    credits: 1000,
    price: 999,
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!
  },
  {
    id: PackId.MEDIUM,
    name: '中额度包',
    label: '5,000 点',
    credits: 5000,
    price: 3999,
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!
  },
  {
    id: PackId.LARGE,
    name: '大额度包',
    label: '10,000 点',
    credits: 10000,
    price: 6999,
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!
  }
]

export const getCreditsPack = (id: PackId) =>
  CreditsPack.find((p) => p.id === id)
