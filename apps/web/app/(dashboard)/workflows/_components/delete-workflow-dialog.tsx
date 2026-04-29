'use client'
import { DeleteWorkflow } from '@/lib/actions/workflows'
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
import { revalidatePath } from 'next/cache'
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
  const [confirmText, setConfirmText] = useState('')

  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      toast.success('Workflow deleted sucessfully', { id })
      setConfirmText('')
      revalidatePath('/workflows')
    },
    onError: () => {
      toast.error('Something went wrong', { id })
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
          </AlertDialogDescription>
          <div className="flex flex-col gap-2 py-4">
            <p>
              If you are sure, enter <b>{name}</b> to confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText('')}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== name || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading('Deleting workflow...', { id })
              deleteMutation.mutate(id)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
