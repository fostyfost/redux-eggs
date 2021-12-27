import type { Extension } from '@redux-eggs/core'

export const getLoggerExtension = (): Extension<any> => {
  const ext: Extension = {}

  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_LOGGER_EXTENSION === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createLogger } = require('redux-logger')

    ext.middlewares = [
      createLogger({
        level: {
          action() {
            return 'log'
          },
        },
        collapsed(_getState: any, _action: any, logEntry: any) {
          return !logEntry.error
        },
      }),
    ]

    ext.beforeAdd = [
      (eggs, store) => {
        console.log(
          'beforeAdd',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ]

    ext.afterAdd = [
      (eggs, store) => {
        console.log(
          'afterAdd',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ]

    ext.beforeRemove = [
      (eggs, store) => {
        console.log(
          'beforeRemove',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ]

    ext.afterRemove = [
      (eggs, store) => {
        console.log(
          'afterRemove',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ]
  }

  return ext
}
