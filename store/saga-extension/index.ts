import { default as createSagaMiddleware } from 'redux-saga'
import { getRefCountedManager, IModuleManager } from 'redux-dynamic-modules-core'
import { getSagaManager } from './manager'
import { sagaEquals } from './saga-equals'
import { ISagaModule, ISagaExtension, ISagaManager, SagaContext } from './contracts'

/**
 * Get an extension that integrates saga with the store
 * sagaContext param is the context to provide to the saga
 */
export function getSagaExtension(sagaContext: SagaContext = {}, onError?: (error: Error) => void): ISagaExtension {
  // Setup the saga middleware
  const sagaMiddleware = createSagaMiddleware<any>({
    context: sagaContext,
    onError,
  })

  const sagaManager: ISagaManager = getRefCountedManager(getSagaManager(sagaMiddleware), sagaEquals)

  return {
    sagaTasks: sagaManager.sagaTasks,

    middleware: [sagaMiddleware],

    onModuleManagerCreated: (moduleManager: IModuleManager) => {
      if (sagaContext) {
        sagaContext.moduleManager = moduleManager
      }
    },

    onModuleAdded: (module: ISagaModule) => {
      if (module.sagas) {
        sagaManager.add(module.sagas)
      }
    },

    onModuleRemoved: (module: ISagaModule) => {
      if (module.sagas) {
        sagaManager.remove(module.sagas)
      }
    },

    dispose: () => {
      sagaManager.dispose()
    },
  }
}
