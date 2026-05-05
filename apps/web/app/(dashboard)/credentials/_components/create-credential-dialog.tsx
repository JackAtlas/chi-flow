'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { Layers2Icon, Loader2Icon } from 'lucide-react'
import CustomDialogHeader from '@/components/custom-dialog-header'
import { useForm } from '@tanstack/react-form'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import {
  createCredentialSchema,
  type createCredentialSchemaType
} from '@/schema/credential'
import { CreateCredential } from '@/lib/credentials'

export default function CreateCredentialDialog({
  triggerText
}: {
  triggerText?: string
}) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      value: ''
    } as createCredentialSchemaType,
    validators: {
      onSubmit: createCredentialSchema
    },
    onSubmit: async ({ value }) => {
      toast.loading('Creating credential...', { id: 'create-credential' })
      mutate(value)
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success('Credential created', { id: 'create-credential' })
      form.reset()
      setOpen(false)
    },
    onError: (error) => {
      if (isRedirectError(error)) {
        toast.success('Credential created', { id: 'create-credential' })
        form.reset()
        setOpen(false)
        return
      }
      toast.error('Failed to create credential', { id: 'create-credential' })
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
        <Button>{triggerText ?? 'Create credential'}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create credential"
        ></CustomDialogHeader>
        <form
          id="create-credential-form"
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
                    Enter a unique and descriptive name for the credential.
                    <br />
                    This name will be used to identify the credential.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="value">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Value
                    <p className="text-xs text-primary">(required)</p>
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
                    Enter the value associated with this credential.
                    <br />
                    This value will be securely encrypted and stored.
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
              form="create-credential-form"
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
