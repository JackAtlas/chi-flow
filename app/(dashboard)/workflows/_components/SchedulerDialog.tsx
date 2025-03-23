'use client'

import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import {
  CalendarIcon,
  ClockIcon,
  TriangleAlertIcon
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import cronstrue from 'cronstrue'
import { CronExpressionParser } from 'cron-parser'
import { RemoveWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule'
import { Separator } from '@/components/ui/separator'

export default function SchedulerDialog(props: {
  cron: string | null
  workflowId: string
}) {
  const [cron, setCron] = useState(props.cron || '')
  const [validCron, setValidCron] = useState(false)
  const [readableCron, setReadableCron] = useState('')

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' })
    },
    onError: () => {
      toast.error('Failed to update schedule', { id: 'cron' })
    }
  })

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success('Schedule removed successfully', { id: 'cron' })
    },
    onError: () => {
      toast.error('Failed to remove schedule', { id: 'cron' })
    }
  })

  useEffect(() => {
    if (cron.length !== 0) {
      try {
        CronExpressionParser.parse(cron)
        const humanCronStr = cronstrue.toString(cron)
        setValidCron(true)
        setReadableCron(humanCronStr)
      } catch (error) {
        console.error(error)
        setValidCron(false)
      }
    }
  }, [cron])

  const workflowHasValidCron = props.cron && props.cron.length > 0
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            'text-sm p-0 h-auto text-orange-500',
            workflowHasValidCron && 'text-primary'
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" /> 设置日程
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="安排运行日程"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            用 cron 表达式设置一个运行周期，所有时间都是 UTC。
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              'bg-accent rounded-md p-4 border text-sm',
              validCron
                ? 'border-primary text-primary'
                : 'border-destructive text-destructive'
            )}
          >
            {validCron ? readableCron : '不是合规的 cron 表达式'}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div>
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  disabled={
                    mutation.isPending ||
                    removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading('正在删除...', {
                      id: 'cron'
                    })
                    removeScheduleMutation.mutate(props.workflowId)
                  }}
                >
                  删除日程
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="flex-1" variant="secondary">
              取消
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="flex-1"
              disabled={mutation.isPending || !validCron}
              onClick={() => {
                toast.loading('Saving schedule...', { id: 'cron' })
                mutation.mutate({
                  id: props.workflowId,
                  cron
                })
              }}
            >
              保存
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
