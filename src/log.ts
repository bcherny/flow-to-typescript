import * as _ from "lodash"

declare global {
  interface Logger {
    debug(...args: any[]): void

    info(...args: any[]): void

    warn(...args: any[]): void

    error(...args: any[]): void
  }

  function getLogger(filename: string): Logger
}

Object.assign(global, {
  getLogger: (filename: string): Logger => {
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
})

export {}
