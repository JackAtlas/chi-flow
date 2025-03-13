export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export enum WorkflowCreateResultText {
  CREATING = '正在创建工作流……',
  CREATE_SUCCESS = '工作流已创建',
  CREATE_FAIL = '工作流创建失败'
}

export enum WorkflowDeleteResultText {
  DELETING = '正在删除工作流……',
  DELETE_SUCCESS = '工作流已删除',
  DELETE_FAIL = '工作流删除失败'
}
