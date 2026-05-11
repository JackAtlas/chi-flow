import TooltipWrapper from '@/components/TooltipWrapper'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { MoreVerticalIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import DeleteWorkflowDialog from './delete-workflow-dialog'
import { useLocale, useTranslations } from 'next-intl'
import { capitalize } from '@/lib/utils'

export default function WorkflowActions({
  workflow
}: {
  workflow: {
    id: string
    name: string
  }
}) {
  const locale = useLocale()
  const t = useTranslations('Workflows.operations')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflow={workflow}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content={capitalize(t('more'))}>
              <div className="flex h-full w-full items-center justify-center">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{capitalize(t('actions'))}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-destructive"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev)
            }}
          >
            <TrashIcon size={16} />
            {capitalize(t('delete'))}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
