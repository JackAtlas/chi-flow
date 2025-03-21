'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { Layers2Icon, Loader2, ShieldEllipsis } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createCredentialSchema,
  createCredentialSchemaType
} from '@/schema/credential'
import { CredentialCreateResultText } from '@/types/credential'
import { CreateCredential } from '@/actions/credentials/createCredential'

function CreateCredentialDialog({
  triggerText
}: {
  triggerText?: string
}) {
  const [open, setOpen] = useState(false)

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {
      name: '',
      value: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success(CredentialCreateResultText.CREATE_SUCCESS, {
        id: 'create-credential'
      })
    },
    onError: (err) => {
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
      // redirect internally throws an error
      if (JSON.stringify(err).includes('NEXT_REDIRECT')) {
        toast.success(CredentialCreateResultText.CREATE_SUCCESS, {
          id: 'create-credential'
        })
      } else {
        toast.error(CredentialCreateResultText.CREATE_FAIL, {
          id: 'create-credential'
        })
      }
    }
  })

  const onSubmit = useCallback(
    (values: createCredentialSchemaType) => {
      toast.loading(CredentialCreateResultText.CREATING, {
        id: 'create-credential'
      })
      mutate(values)
    },
    [mutate]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset()
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? '创建凭证'}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={ShieldEllipsis}
          title="创建凭证"
        ></CustomDialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      名称
                      <p className="text-xs text-primary">(必填)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      给凭证起一个不重复的描述性强的名称
                      <br />
                      这个名称能帮助您分辨您的凭证
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      值
                      <p className="text-xs text-muted-foreground">
                        (必填)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      输入凭证的值
                      <br />
                      该值将会被加密存储
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <Button
                type="submit"
                className="w-full bg-primary"
                disabled={isPending}
              >
                {!isPending && '新建'}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCredentialDialog
