'use client'

import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { CoinsIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { DragEvent } from 'react'

export default function TaskMenu() {
  const t = useTranslations('Workflow.editor.tasks')
  return (
    <aside className="h-full w-85 max-w-85 min-w-85 border-separate overflow-auto border-r-2 px-4 py-2">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          'extraction',
          'interactions',
          'storage',
          'timing',
          'results'
        ]}
      >
        <AccordionItem value="interactions">
          <AccordionTrigger className="font-bold">{t('ui')}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.NAVIGATE_URL} />
            <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
            <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">{t('de')}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">{t('ds')}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="font-bold">{t('tc')}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="results">
          <AccordionTrigger className="font-bold">
            {t('results')}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType]

  const onDragStart = (event: DragEvent, type: TaskType) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Button
      variant="secondary"
      className="flex w-full items-center justify-between gap-2 border"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={20}>{task.label}</task.icon>
        {task.label}
      </div>
      <Badge className="flex items-center gap-2" variant="outline">
        <CoinsIcon size={16} />
        {task.credits}
      </Badge>
    </Button>
  )
}
