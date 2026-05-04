'use client'

import CustomDialogHeader from '@/components/custom-dialog-header'
import {
  RemoveWorkflowSchedule,
  UpdateWorkflowCron
} from '@/lib/workflow/workflow'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { cn } from '@workspace/ui/lib/utils'
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { toast } from 'sonner'
import cronstrue from 'cronstrue'
import { Separator } from '@workspace/ui/components/separator'

export default function SchedulerDialog(props: {
  cron: string | null
  workflowId: string
}) {
  const [open, setOpen] = useState(false)
  const [cron, setCron] = useState(props.cron || '')

  const setScheduleMutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' })
      setOpen(false)
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'cron' })
    }
  })

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' })
      setOpen(false)
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'cron' })
    }
  })

  const deferredCron = useDeferredValue(cron)

  const { validCron, readableCron } = useMemo(() => {
    if (!deferredCron) {
      return { validCron: false, readableCron: 'Enter a cron expression' }
    }
    try {
      return {
        validCron: true,
        readableCron: cronstrue.toString(deferredCron)
      }
    } catch {
      return { validCron: false, readableCron: 'Not a valid cron expression' }
    }
  }, [deferredCron])

  const workflowHasValidCron = props.cron && props.cron.length > 0
  const readableSavedCron = useMemo(() => {
    try {
      return props.cron ? cronstrue.toString(props.cron) : null
    } catch {
      return null
    }
  }, [props.cron])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            'h-auto p-0 text-sm text-orange-500',
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
              <TriangleAlertIcon className="size-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="space-y-4 p-6">
          <DialogDescription>
            Specify a cron expression to schedule periodic workflow
            execution.All times are in UTC
          </DialogDescription>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />

          <div
            className={cn(
              'rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive',
              validCron && 'border-primary bg-primary/10 text-primary'
            )}
          >
            {readableCron}
          </div>

          {workflowHasValidCron && (
            <div>
              <Button
                className="w-full cursor-pointer border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                disabled={
                  setScheduleMutation.isPending ||
                  removeScheduleMutation.isPending
                }
                variant="outline"
                onClick={() => {
                  toast.loading('Removing schedule...', { id: 'cron' })
                  removeScheduleMutation.mutate(props.workflowId)
                }}
              >
                Remove current schedule
              </Button>
              <Separator className="my-4" />
            </div>
          )}
        </div>
        <DialogFooter className="mx-0 gap-2">
          <Button
            className="cursor-pointer"
            disabled={setScheduleMutation.isPending}
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            disabled={setScheduleMutation.isPending || !validCron}
            onClick={() => {
              toast.loading('Saving...', { id: 'cron' })
              setScheduleMutation.mutate({ cron, id: props.workflowId })
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
