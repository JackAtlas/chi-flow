'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  createWorkflowSchema,
  createWorkflowSchemaType
} from '@/schema/workflow'
import { Layers2Icon, Loader2 } from 'lucide-react'
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
import { CreateWorkflow } from '@/actions/workflows/createWorkflow'
import { toast } from 'sonner'
import { WorkflowCreateResultText } from '@/types/workflow'

function CreateWorkflowDialog({
  triggerText
}: {
  triggerText?: string
}) {
  const [open, setOpen] = useState(false)

  const form = useForm<createWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: CreateWorkflow,
    onSuccess: () => {
      toast.success(WorkflowCreateResultText.CREATE_SUCCESS, {
        id: 'create-workflow'
      })
    },
    onError: (err) => {
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
      // redirect internally throws an error
      if (JSON.stringify(err).includes('NEXT_REDIRECT')) {
        toast.success(WorkflowCreateResultText.CREATE_SUCCESS, {
          id: 'create-workflow'
        })
      } else {
        toast.error(WorkflowCreateResultText.CREATE_FAIL, {
          id: 'create-workflow'
        })
      }
    }
  })

  const onSubmit = useCallback(
    (values: createWorkflowSchemaType) => {
      toast.loading(WorkflowCreateResultText.CREATING, {
        id: 'create-workflow'
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
        <Button>{triggerText ?? '创建工作流'}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="创建工作流"
          subTitle="开始构建你的工作流"
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
                      名称是不可重复的
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      描述
                      <p className="text-xs text-muted-foreground">
                        (可选)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      写一段关于该工作流是做什么的描述。
                      <br />
                      这不是必须的，但可以帮你记住该工作流的目标。
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

export default CreateWorkflowDialog
