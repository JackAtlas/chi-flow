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
import { useTranslations } from 'next-intl'
import { capitalize } from '@/lib/utils'

export default function CreateCredentialDialog({
  triggerText
}: {
  triggerText?: string
}) {
  const t = useTranslations('Credentials.createCredentialDialog')
  const f = useTranslations('Form')

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? t('button')}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title={t('title')}
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
                    {t('fields.name.label')}
                    <p className="text-xs text-primary">({f('required')})</p>
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
                    {t.rich('fields.name.desc', {
                      br: () => <br></br>
                    })}
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
                    {t('fields.value.label')}
                    <p className="text-xs text-primary">({f('required')})</p>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    className="resize-none break-all"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>
                    {t.rich('fields.value.desc', {
                      br: () => <br></br>
                    })}
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
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                capitalize(f('proceed'))
              )}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
