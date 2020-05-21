import { getSagaExtension } from './saga-extension'
import { createStore } from 'redux-dynamic-modules'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule } from './saga-extension/contracts'
import { WindowWithStore } from './contracts'

declare const window: WindowWithStore

const makeStore = (modules: ISagaModule[]) => {
  const sagaExtension = getSagaExtension()

  const store = createStore(
    {
      initialState: {},
      enhancers: [],
      advancedComposeEnhancers: composeWithDevTools({}),
      extensions: [sagaExtension],
    },
    ...modules,
  ) as IModuleStoreWithSagaTasks

  store.sagaTasks = sagaExtension.sagaTasks

  return store
}

export const initStore = (modules: ISagaModule[] | undefined = []) => {
  if (typeof window === 'undefined') {
    return makeStore(modules)
  }

  // Memoize store if client
  if (!(STOREKEY in window)) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    window[STOREKEY] = makeStore(modules)
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return window[STOREKEY]
}
