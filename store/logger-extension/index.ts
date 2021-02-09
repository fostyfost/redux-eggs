import type { IExtension } from 'redux-dynamic-modules-core'

export const getLoggerExtension = (): IExtension | undefined => {
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_LOGGER_EXTENSION === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
