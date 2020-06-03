import { STOREKEY } from './index'
import { IModuleStoreWithSagaTasks, ISagaModule, SagaContext } from './saga-extension/contracts'
import { GetStoreParams, WindowWithStore } from './contracts'
import { getSagaExtension } from './saga-extension'
import { createStore } from './create-store'
import produce, { Draft } from 'immer'
import { HYDRATE } from './hydrate-action'
import { AnyAction, combineReducers, ReducersMapObject } from 'redux'

declare const window: WindowWithStore

const combineReducersWithGlobalActions = (reducersMap: ReducersMapObject) => {
  const reducersMapWithHydration = Object.keys(reducersMap).reduce((acc, reducerKey) => {
    acc[reducerKey] = (state: any, action: AnyAction) => {
      let nextState = state

      if (action.type === HYDRATE && action.payload[reducerKey]) {
        nextState = produce(nextState, (draft: Draft<{ [key: string]: any }>) => {
          Object.entries(action.payload[reducerKey]).forEach(([key, value]) => {
            draft[key] = value
          })
        })
      }

      return reducersMap[reducerKey](nextState, action)
    }

    return acc
  }, {} as ReducersMapObject)

  return combineReducers(reducersMapWithHydration)
}

const createStoreWithSagaTasks = (modules: ISagaModule[], sagaContext?: SagaContext) => {
  const sagaExtension = getSagaExtension(sagaContext)

  const store = createStore(
    {
      extensions: [sagaExtension],
      advancedCombineReducers: combineReducersWithGlobalActions,
    },
    modules,
  ) as IModuleStoreWithSagaTasks

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
