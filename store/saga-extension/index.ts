import { Effect, effectTypes } from '@redux-saga/core/effects'
import { batch } from 'react-redux'
import { getRefCountedManager, IModuleManager } from 'redux-dynamic-modules-core'
import { default as createSagaMiddleware, EffectMiddleware } from 'redux-saga'

import { SagaContext, SagaExtension, SagaManager, SagaModule } from '@/store/saga-extension/contracts'
import { getSagaManager } from '@/store/saga-extension/manager'
import { sagaEquals } from '@/store/saga-extension/saga-equals'

const effectMiddleware: EffectMiddleware = next => effect => {
  if (
    effect &&
    effect.type === effectTypes.ALL &&
    Array.isArray(effect.payload) &&
    // Чтобы применить батчинг, внутри `payload` должны быть только `put`-эффекты
    !(effect.payload as Effect[]).some(subEffect => subEffect.type !== effectTypes.PUT)
  ) {
    batch(() => next(effect))
    return
  }

  next(effect)
}

/**
 * Get an extension that integrates saga with the store
 * sagaContext param is the context to provide to the saga
 */
export function getSagaExtension(sagaContext: SagaContext = {}, onError?: (error: Error) => void): SagaExtension {
  // Setup the saga middleware
  const sagaMiddleware = createSagaMiddleware<any>({
    context: sagaContext,
    onError,
    effectMiddlewares: [effectMiddleware],
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
