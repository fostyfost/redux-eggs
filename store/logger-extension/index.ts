import { IExtension } from 'redux-dynamic-modules-core'

export const getLoggerExtension = (): IExtension | undefined => {
  if (process.env.NODE_ENV === 'development') {
    const { createLogger } = require('redux-logger')

    const logger = createLogger({
      level: {
        action: () => 'log',
      },
      collapsed: (_getState: any, _action: any, logEntry: any) => !logEntry.error,
    })

    return { middleware: [logger] }
  }

  return undefined
}
