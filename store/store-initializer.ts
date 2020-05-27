import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule } from './saga-extension/contracts'
import { WindowWithStore } from './contracts'
import { getSagaExtension } from './saga-extension'
import { createStore } from './create-store'

declare const window: WindowWithStore

const createStoreWithSagaTasks = (initialModules: ISagaModule[]) => {
  const sagaExtension = getSagaExtension()

  const store = createStore({ extensions: [sagaExtension] }, initialModules) as IModuleStoreWithSagaTasks

  store.sagaTasks = sagaExtension.sagaTasks

  return store
}

export const getStore = (initialModules: ISagaModule[] | undefined = []) => {
  if (typeof window === 'undefined') {
    return createStoreWithSagaTasks(initialModules)
  }

  // Memoize store if client
  if (!(STOREKEY in window)) {
    window[STOREKEY] = createStoreWithSagaTasks(initialModules)
  }

  return window[STOREKEY]
}
