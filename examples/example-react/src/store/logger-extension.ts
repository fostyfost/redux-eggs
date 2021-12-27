import type { Extension } from '@redux-eggs/core/dist'
import { createLogger } from 'redux-logger'

export const getLoggerExtension = (): Extension<any> => {
  const logger = createLogger({
    level: {
      action() {
        return 'log'
      },
    },
    collapsed(_getState: any, _action: any, logEntry: any) {
      return !logEntry.error
    },
  })

  return {
    middlewares: [logger],

    beforeAdd: [
      (eggs, store) => {
        console.log(
          'beforeAdd',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ],

    afterAdd: [
      (eggs, store) => {
        console.log(
          'afterAdd',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ],

    beforeRemove: [
      (eggs, store) => {
        console.log(
          'beforeRemove',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ],

    afterRemove: [
      (eggs, store) => {
        console.log(
          'afterRemove',
          eggs.map(egg => egg.id),
          store.getEggs().map(egg => egg.value.id),
        )
      },
    ],
  }
}
