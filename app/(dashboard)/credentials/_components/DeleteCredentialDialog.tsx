'use client'

import { DeleteCredential } from '@/actions/credentials/deleteCredentials'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CredentialDelteResultText } from '@/types/credential'
import { useMutation } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'

import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  name: string
}

function DeleteCredentialDialog({ name }: Props) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success(CredentialDelteResultText.DELETE_SUCCESS, {
        id: name
      })
    },
    onError: () => {
      toast.error(CredentialDelteResultText.DELETE_FAIL, {
        id: name
      })
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
          <AlertDialogTitle>确定要删除？</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">凭证被删除后将无法恢复。</span>
            <span className="block pt-4">
              为防止意外，请输入 <b>{name}</b> 以继续：
            </span>
            <Input
              className="mt-2 pb-4"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              confirmText !== name || deleteMutation.isPending
            }
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => {
              toast.loading(CredentialDelteResultText.DELETING, {
                id: name
              })
              deleteMutation.mutate(name)
            }}
          >
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCredentialDialog
