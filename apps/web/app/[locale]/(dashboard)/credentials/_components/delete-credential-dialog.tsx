'use client'
import { useRouter } from '@/i18n/navigation'
import { DeleteCredential } from '@/lib/credentials'
import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@workspace/ui/components/alert-dialog'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  name: string
}

export default function DeleteCredentialDialog({ name }: Props) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success('Credential deleted sucessfully', { id: name })
      setConfirmText('')
      router.replace('/workflows')
    },
    onError: () => {
      toast.error('Something went wrong', { id: name })
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to recover it.
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
              toast.loading('Deleting credential...', { id: name })
              deleteMutation.mutate(name)
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
