import { getRefCountedManager, IModuleManager } from 'redux-dynamic-modules-core'
import { default as createSagaMiddleware } from 'redux-saga'

import { SagaExtension, SagaManager, SagaModule, SagaContext } from './contracts'
import { getSagaManager } from './manager'
import { sagaEquals } from './saga-equals'

/**
 * Get an extension that integrates saga with the store
 * sagaContext param is the context to provide to the saga
 */
export function getSagaExtension(sagaContext: SagaContext = {}, onError?: (error: Error) => void): SagaExtension {
  // Setup the saga middleware
  const sagaMiddleware = createSagaMiddleware<any>({
    context: sagaContext,
    onError,
  })

  const sagaManager: SagaManager = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals)

  return {
    sagaTasks: sagaManager.sagaTasks,

    middleware: [sagaMiddleware],

    onModuleManagerCreated: (moduleManager: IModuleManager) => {
      if (sagaContext) {
        sagaContext.moduleManager = moduleManager
      }
    },

    onModuleAdded: (module: SagaModule) => {
      if (module.sagas) {
        sagaManager.add(module.sagas)
      }
    },

    onModuleRemoved: (module: SagaModule) => {
      if (module.sagas) {
        sagaManager.remove(module.sagas)
      }
    },

    dispose: () => {
      sagaManager.dispose()
    },
  }
}
