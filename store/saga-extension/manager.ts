import { getMap } from 'redux-dynamic-modules-core'
import { SagaMiddleware, Task } from 'redux-saga'

import { SagaManager, SagaRegistration, SagaWithArguments } from '@/store/saga-extension/contracts'
import { sagaEquals } from '@/store/saga-extension/saga-equals'

const runSaga = (sagaMiddleware: SagaMiddleware<any>, sagaRegistration: SagaRegistration): Task => {
  if (typeof sagaRegistration === 'function') {
    return sagaMiddleware.run(sagaRegistration as () => Iterator<any>)
  }

  return sagaMiddleware.run(
    (sagaRegistration as SagaWithArguments).saga,
    (sagaRegistration as SagaWithArguments).argument,
  )
}

/**
 * Creates saga items which can be used to start and stop sagas dynamically
 */
export const getSagaManager = (sagaMiddleware: SagaMiddleware<any>): SagaManager => {
  const sagaTasks = getMap<SagaRegistration, Task>(sagaEquals)

  return {
    sagaTasks,
    getItems: (): SagaRegistration[] => [...sagaTasks.keys],
    add: (sagas: SagaRegistration[]) => {
      if (!sagas) {
        return
      }

      sagas.forEach(saga => {
        if (saga && !sagaTasks.get(saga)) {
          sagaTasks.add(saga, runSaga(sagaMiddleware, saga))
        }
      })
    },
    remove: (sagas: SagaRegistration[]) => {
      if (!sagas) {
        return
      }

      sagas.forEach(saga => {
        if (sagaTasks.get(saga)) {
          const task = sagaTasks.remove(saga)
          task.cancel()
        }
      })
    },
    dispose: () => {
      // Cancel everything
      sagaTasks.keys.forEach(k => sagaTasks.get(k).cancel())
    },
  }
}
