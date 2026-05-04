'use client'

import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@workspace/ui/components/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SaveBtn from './save-btn'
import ExecuteBtn from './execute-btn'
import NavigationTabs from './navigation-tabs'
import PublishBtn from './publish-btn'
import UnpublishBtn from './unpublish-btn'

interface Props {
  title: string
  subTitle?: string
  workflowId: string
  hideButtons?: boolean
  isPublished?: boolean
}

export default function Topbar({
  title,
  subTitle,
  workflowId,
  hideButtons = false,
  isPublished = false
}: Props) {
  const router = useRouter()
  return (
    <header className="flex h-15 w-full border-separate justify-between border-b-2 bg-background p-2">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={() => {
              router.back()
            }}
          >
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="truncate font-bold text-ellipsis">{title}</p>
          {subTitle && (
            <p className="truncate text-xs text-ellipsis text-muted-foreground">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex flex-1 justify-end gap-1">
        {hideButtons === false && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished && <UnpublishBtn workflowId={workflowId} />}
            {!isPublished && (
              <>
                <SaveBtn workflowId={workflowId} />
                <PublishBtn workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  )
}
