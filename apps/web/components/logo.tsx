import { Link } from '@/i18n/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { SquareDashedMousePointerIcon } from 'lucide-react'

export default function Logo({
  fontSize = '2xl',
  iconSize = 20
}: {
  fontSize?: string
  iconSize?: number
}) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 font-extrabold',
        `text-${fontSize}`
      )}
    >
      <div className="rounded-xl bg-linear-to-r from-primary to-primary/90 p-2">
        <SquareDashedMousePointerIcon
          size={iconSize}
          className="stroke-white"
        />
      </div>
      <div>
        <span className="bg-linear-to-r from-primary to-primary/90 bg-clip-text text-transparent">
          Chi
        </span>
        <span className="text-stone-700 dark:text-stone-300">Flow</span>
      </div>
    </Link>
  )
}
