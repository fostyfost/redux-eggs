import type { Extension } from '@redux-eggs/core'
import { createLogger } from 'redux-logger'

import type { AppStore } from './index'

export const getLoggerExtension = (): Extension => {
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
    middleware: logger,

    beforeAdd(eggs, store: AppStore) {
      console.log(
        'beforeAdd',
        eggs.map(egg => egg.id),
        store.getEggs().map(egg => egg.value.id),
      )
    },

    afterAdd(eggs, store: AppStore) {
      console.log(
        'afterAdd',
        eggs.map(egg => egg.id),
        store.getEggs().map(egg => egg.value.id),
      )
    },

    beforeRemove(eggs, store: AppStore) {
      console.log(
        'beforeRemove',
        eggs.map(egg => egg.id),
        store.getEggs().map(egg => egg.value.id),
      )
    },

    afterRemove(eggs, store: AppStore) {
      console.log(
        'afterRemove',
        eggs.map(egg => egg.id),
        store.getEggs().map(egg => egg.value.id),
      )
    },
  }
}
