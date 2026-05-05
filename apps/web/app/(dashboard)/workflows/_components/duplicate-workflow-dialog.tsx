'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { CopyIcon, Layers2Icon, Loader2Icon } from 'lucide-react'
import CustomDialogHeader from '@/components/custom-dialog-header'
import { useForm } from '@tanstack/react-form'
import {
  duplicateWorkflowSchema,
  type duplicateWorkflowSchemaType
} from '@/schema/workflow'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { useMutation } from '@tanstack/react-query'
import { DuplicateWorkflow } from '@/lib/workflow/workflow'
import { toast } from 'sonner'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { cn } from '@workspace/ui/lib/utils'

export default function DuplicateWorkflowDialog({
  workflowId
}: {
  workflowId: string
}) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      workflowId
    } as duplicateWorkflowSchemaType,
    validators: {
      onSubmit: duplicateWorkflowSchema
    },
    onSubmit: async ({ value }) => {
      toast.loading('Duplicating workflow...', { id: 'duplicate-workflow' })
      mutate(value)
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success('Workflow duplicated', { id: 'duplicate-workflow' })
      form.reset()
      setOpen(false)
    },
    onError: (error) => {
      if (isRedirectError(error)) {
        toast.success('Workflow duplicated', { id: 'duplicate-workflow' })
        form.reset()
        setOpen(false)
        return
      }
      toast.error('Failed to duplicate workflow', { id: 'duplicate-workflow' })
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset()
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100'
          )}
        >
          <CopyIcon className="size-4 cursor-pointer text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Duplicate workflow"
        ></CustomDialogHeader>
        <form
          id="duplicate-workflow-form"
          className="w-full space-y-8"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Name<p className="text-xs text-primary">(required)</p>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>
                    Choose a descriptive and unique name
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="description">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Description
                    <p className="text-xs text-muted-foreground">(optional)</p>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    className="resize-none"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>
                    Provide a brief description of what your workflow does.
                    <br />
                    This is optional but can help you remember the
                    workflow&apos;s purpose.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </form>
        <DialogFooter>
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="duplicate-workflow-form"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : 'Proceed'}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
