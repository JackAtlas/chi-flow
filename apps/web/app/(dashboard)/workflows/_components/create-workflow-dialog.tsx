"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Layers2Icon } from "lucide-react"
import CustomDialogHeader from "@/components/custom-dialog-header"

export default function CreateWorkflowDialog({
  triggerText,
}: {
  triggerText?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create workflow"
        ></CustomDialogHeader>
      </DialogContent>
    </Dialog>
  )
}
