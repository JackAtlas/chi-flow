import { TaskParamType, TaskType } from '@/types/task'
import { WorkflowTask } from '@/types/workflow'
import { GlobeIcon, LucideProps } from 'lucide-react'

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: '启动浏览器',
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: 'Website Url',
      text: '网址',
      type: TaskParamType.STRING,
      helperText: 'eg: https://www.taobao.com',
      required: true,
      hideHandle: true
    }
  ],
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE
    }
  ]
} satisfies WorkflowTask
