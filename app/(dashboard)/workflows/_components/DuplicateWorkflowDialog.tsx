'use client'

import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType
} from '@/schema/workflow'
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react'
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
import { WorkflowDuplicateResultText } from '@/types/workflow'
import { DuplicateWorkflow } from '@/actions/workflows/duplicateWorkflow'
import { cn } from '@/lib/utils'

function DuplicateWorkflowDialog({
  workflowId
}: {
  workflowId?: string
}) {
  const [open, setOpen] = useState(false)

  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      name: '',
      description: '',
      workflowId
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success(WorkflowDuplicateResultText.DUPLICATE_SUCCESS, {
        id: 'duplicate-workflow'
      })
      setOpen((prev) => !prev)
    },
    onError: (err) => {
      // https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
      // redirect internally throws an error
      if (JSON.stringify(err).includes('NEXT_REDIRECT')) {
        toast.success(WorkflowDuplicateResultText.DUPLICATE_SUCCESS, {
          id: 'duplicate-workflow'
        })
      } else {
        toast.error(WorkflowDuplicateResultText.DUPLICATE_FAIL, {
          id: 'duplicate-workflow'
        })
      }
    }
  })

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading(WorkflowDuplicateResultText.DUPLICATING, {
        id: 'duplicate-workflow'
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
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100'
          )}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="复制工作流"
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

export default DuplicateWorkflowDialog
