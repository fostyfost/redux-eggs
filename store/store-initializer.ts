import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule, SagaContext } from './saga-extension/contracts'
import { GetStoreParams, WindowWithStore } from './contracts'
import { getSagaExtension } from './saga-extension'
import { createStore } from './create-store'

declare const window: WindowWithStore

const createStoreWithSagaTasks = (modules: ISagaModule[], sagaContext?: SagaContext) => {
  const sagaExtension = getSagaExtension(sagaContext)

  const store = createStore({ extensions: [sagaExtension] }, modules) as IModuleStoreWithSagaTasks

  store.sagaTasks = sagaExtension.sagaTasks

  return store
}

export const getStore = ({ rootModules = [], pageModules = [] }: GetStoreParams): IModuleStoreWithSagaTasks => {
  if (typeof window === 'undefined') {
    return createStoreWithSagaTasks(rootModules.concat(pageModules))
  }

  // Memoize store if client
  if (!(STOREKEY in window)) {
    window[STOREKEY] = createStoreWithSagaTasks(rootModules.concat(pageModules))
  }

  return window[STOREKEY]
}
