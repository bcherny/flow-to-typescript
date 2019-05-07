import * as _ from "lodash"

export interface Logger {
  debug(...args: any[]): void

  info(...args: any[]): void

  warn(...args: any[]): void

  error(...args: any[]): void
}

export function getLogger(filename: string): Logger {
  const levels = ["debug", "info", "warn", "error"]
  const name = _.last(filename.split("/"))
  return levels.reduce(
    (logger, level) => {
      logger[level] = (...args: any) => {
        const consoleRef = (console as any)[level].bind(console)
        consoleRef(`[${name}]: `, ...args)
      }

      return logger
    },
    {} as any
  )
}

export {}
