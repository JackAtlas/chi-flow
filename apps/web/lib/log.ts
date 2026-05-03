import {
  LogLevels,
  type Log,
  type LogCollector,
  type LogFunction,
  type LogLevel
} from '@/types/log'

export function createLogCollector(): LogCollector {
  const logs: Log[] = []
  const getAll = () => logs

  const logFunctions = {} as Record<LogLevel, LogFunction>
  LogLevels.forEach(
    (level) =>
      (logFunctions[level] = (message: string) => {
        logs.push({ message, level, timestamp: new Date() })
      })
  )

  return {
    getAll,
    info: (message: string) =>
      logs.push({ level: 'info', message, timestamp: new Date() }),
    warning: (message: string) =>
      logs.push({ level: 'warning', message, timestamp: new Date() }),
    error: (message: string) =>
      logs.push({ level: 'error', message, timestamp: new Date() })
  }
}
