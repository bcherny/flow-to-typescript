import * as _ from "lodash"

export enum LogLevel {
  debug,
  info,
  warn,
  error
}

let threshold = LogLevel.info

export type LogLevelName = keyof typeof LogLevel

export type Logger = { [level in LogLevelName]: (...args: any[]) => void }

export function setLogThreshold(level: LogLevel) {
  threshold = level
}

export function getLogger(filename: string): Logger {
  const levels: Array<LogLevelName> = ["debug", "info", "warn", "error"]
  const name = _.last(filename.split("/"))
  return levels.reduce(
    (logger, level) => {
      logger[level] = (...args: any) => {
        if (LogLevel[level] < threshold) {
          return
        }

        const consoleRef = (console as any)[level].bind(console)
        consoleRef(`[${name}] (${level}): `, ...args)
      }

      return logger
    },
    {} as any
  )
}

export {}
