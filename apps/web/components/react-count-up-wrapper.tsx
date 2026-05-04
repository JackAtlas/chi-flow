import dynamic from 'next/dynamic'

const CountUp = dynamic(() => import('react-countup'), {
  ssr: false,
  loading: () => <span>-</span>
})

export default function ReactCountUpWrapper({ value }: { value: number }) {
  return (
    <CountUp duration={0.5} preserveValue end={value} decimals={0}></CountUp>
  )
}
