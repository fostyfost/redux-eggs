import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule } from './saga-extension/contracts'
import { WindowWithStore } from './contracts'
import { getSagaExtension } from './saga-extension'
import { createStore } from './create-store'

declare const window: WindowWithStore

const getStoreCreator = () => {
  let store: IModuleStoreWithSagaTasks

  return (initialModules: ISagaModule[]) => {
    if (!store) {
      const sagaExtension = getSagaExtension()

      store = createStore({ extensions: [sagaExtension] }, initialModules) as IModuleStoreWithSagaTasks

      store.sagaTasks = sagaExtension.sagaTasks
    }

    return store
  }
}

const createAdvancedStore = getStoreCreator()

export const getStore = (initialModules: ISagaModule[] | undefined = []) => {
  if (typeof window === 'undefined') {
    return createAdvancedStore(initialModules)
  }

  // Memoize store if client
  if (!(STOREKEY in window)) {
    window[STOREKEY] = createAdvancedStore(initialModules)
  }

  return window[STOREKEY]
}
