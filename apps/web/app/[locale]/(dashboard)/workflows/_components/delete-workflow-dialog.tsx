'use client'
import { useRouter } from '@/i18n/navigation'
import { capitalize } from '@/lib/utils'
import { DeleteWorkflow } from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@workspace/ui/components/alert-dialog'
import { Input } from '@workspace/ui/components/input'
import { cn } from '@workspace/ui/lib/utils'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  workflow: {
    id: string
    name: string
  }
}

export default function DeleteWorkflowDialog({
  open,
  setOpen,
  workflow: { id, name }
}: Props) {
  const t = useTranslations('Workflows')
  const f = useTranslations('Form')

  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      toast.success('Workflow deleted sucessfully', { id })
      setConfirmText('')
      router.replace('/workflows')
    },
    onError: () => {
      toast.error('Something went wrong', { id })
    }
  })

  const isConfirmDisabled = confirmText !== name || deleteMutation.isPending
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteWorkflowDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteWorkflowDialog.desc')}
          </AlertDialogDescription>
          <div className="flex w-full flex-col gap-2 py-4">
            <p>
              {t('deleteWorkflowDialog.surePrefix')}
              <b className="text-destructive">{name}</b>
              {t('deleteWorkflowDialog.sureSuffix')}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={() => setConfirmText('')}
          >
            {capitalize(f('cancel'))}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isConfirmDisabled}
            className={cn(
              'bg-destructive! text-destructive-foreground! hover:bg-destructive/80!',
              isConfirmDisabled ? '' : 'cursor-pointer'
            )}
            onClick={() => {
              toast.loading('Deleting workflow...', { id })
              deleteMutation.mutate(id)
            }}
          >
            {capitalize(t('operations.delete'))}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
