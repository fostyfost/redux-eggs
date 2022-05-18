import { getCounter } from '@redux-eggs/core'
import type { Saga, SagaMiddleware, Task } from 'redux-saga'

import type { SagaTray } from '@/contracts'

interface Item {
  saga: Saga
  task: Task
}

export const getSagaTray = (sagaMiddleware: SagaMiddleware): SagaTray => {
  const counter = getCounter<Saga>()

  let items: Item[] = []

  return {
    getTasks() {
      return items.map(item => item.task)
    },

    add(sagasToAdd: Saga[]): void {
      sagasToAdd.forEach(saga => {
        if (!counter.getCount(saga)) {
          items.push({ saga, task: sagaMiddleware.run(saga) })
        }

        counter.add(saga)
      })
    },

    remove(sagasToRemove: Saga[]): void {
      sagasToRemove.forEach(saga => {
        if (counter.getCount(saga) === 1) {
          items = items.filter(item => {
            const result = item.saga === saga

            if (result) {
              item.task.cancel()
            }

            return !result
          })
        }

        counter.remove(saga)
      })
    },
  }
}
