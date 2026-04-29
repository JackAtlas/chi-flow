import { Loader2Icon } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2Icon size={30} className="animate-spin stroke-primary" />
    </div>
  )
}
