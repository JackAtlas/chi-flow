import { LucideProps } from 'lucide-react'
import React from 'react'
import { TaskParam, TaskType } from './task'
import { AppNode } from './appNode'

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export type WorkflowTask = {
  label: string
  icon: React.FC<LucideProps>
  type: TaskType
  isEntryPoint?: boolean
  inputs: TaskParam[]
  outputs: TaskParam[]
  credits: number
}

export type WorkflowExecutionPlanPhase = {
  phase: number
  nodes: AppNode[]
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[]

export enum WorkflowCreateResultText {
  CREATING = '正在创建工作流……',
  CREATE_SUCCESS = '工作流已创建',
  CREATE_FAIL = '工作流创建失败'
}

export enum WorkflowUpdateResultText {
  UPDATING = '正在更新工作流……',
  UPDATE_SUCCESS = '工作流已更新',
  UPDATE_FAIL = '工作流更新失败'
}

export enum WorkflowDeleteResultText {
  DELETING = '正在删除工作流……',
  DELETE_SUCCESS = '工作流已删除',
  DELETE_FAIL = '工作流删除失败'
}

export enum WorkflowStatusText {
  NOT_FOUND = '工作流不存在',
  NOT_DRAFT = '工作流不是草稿状态',
  NOT_PUBLISHED = '工作流未发布'
}
