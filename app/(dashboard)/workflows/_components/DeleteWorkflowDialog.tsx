'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

import React, { useState } from 'react'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  workflowName: string
}

function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName
}: Props) {
  const [confirmText, setConfirmText] = useState('')
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        setConfirmText('')
        setOpen(value)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除？</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block">工作流被删除后将无法恢复。</span>
            <span className="block pt-4">
              为防止意外，请输入 <b>{workflowName}</b> 以继续：
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
            disabled={confirmText !== workflowName}
            className="bg-destructive hover:bg-destructive/90"
          >
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog
