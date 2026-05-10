'use client'

import { GetAvailableCredits } from '@/lib/workflow/billing'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@workspace/ui/lib/utils'
import { CoinsIcon, Loader2Icon } from 'lucide-react'
import ReactCountUpWrapper from './react-count-up-wrapper'
import { buttonVariants } from '@workspace/ui/components/button'
import { Link } from '@/i18n/navigation'

export default function UserAvailableBadge() {
  const query = useQuery({
    queryKey: ['user-available-credits'],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000
  })

  return (
    <Link
      href="/billing"
      className={cn(
        'w-full items-center space-x-2',
        buttonVariants({ variant: 'outline' })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="size-4 animate-spin" />}
        {!query.isLoading && query.data && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading && query.data === undefined && '-'}
      </span>
    </Link>
  )
}
