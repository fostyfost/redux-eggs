import { SagaMiddleware, Task } from 'redux-saga'
import { getMap } from 'redux-dynamic-modules-core'
import { sagaEquals } from './saga-equals'
import { ISagaManager, ISagaRegistration, ISagaWithArguments } from './contracts'

const runSaga = (sagaMiddleware: SagaMiddleware<any>, sagaRegistration: ISagaRegistration): Task => {
  if (typeof sagaRegistration === 'function') {
    return sagaMiddleware.run(sagaRegistration as () => Iterator<any>)
  }

  return sagaMiddleware.run(
    (sagaRegistration as ISagaWithArguments).saga,
    (sagaRegistration as ISagaWithArguments).argument,
  )
}

/**
 * Creates saga items which can be used to start and stop sagas dynamically
 */
export const getSagaManager = (sagaMiddleware: SagaMiddleware<any>): ISagaManager => {
  const sagaTasks = getMap<ISagaRegistration, Task>(sagaEquals)

  return {
    sagaTasks,
    getItems: (): ISagaRegistration[] => [...sagaTasks.keys],
    add: (sagas: ISagaRegistration[]) => {
      if (!sagas) {
        return
      }

      sagas.forEach(saga => {
        if (saga && !sagaTasks.get(saga)) {
          sagaTasks.add(saga, runSaga(sagaMiddleware, saga))
        }
      })
    },
    remove: (sagas: ISagaRegistration[]) => {
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
