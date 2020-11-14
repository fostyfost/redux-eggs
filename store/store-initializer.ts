import produce, { Draft } from 'immer'
import { AnyAction, combineReducers, ReducersMapObject } from 'redux'
import { IExtension } from 'redux-dynamic-modules-core'

import { StoreActionType } from '@/store/action-types'
import { GetStoreParams, ModuleTuple, STOREKEY, WindowWithStore } from '@/store/contracts'
import { createStore } from '@/store/create-store'
import { getLoggerExtension } from '@/store/logger-extension'
import { getSagaExtension } from '@/store/saga-extension'
import { ModuleStoreWithSagaTasks, SagaContext } from '@/store/saga-extension/contracts'

declare const window: WindowWithStore

const combineReducersWithGlobalActions = (reducersMap: ReducersMapObject) => {
  const reducersMapWithHydration = Object.keys(reducersMap).reduce((acc, reducerKey) => {
    acc[reducerKey] = (state: any, action: AnyAction) => {
      let nextState = state

      if (action.type === StoreActionType.HYDRATE && action.payload[reducerKey]) {
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

interface StoreCreatorConfig {
  modules: ModuleTuple
  sagaContext?: SagaContext
  extensions?: IExtension[]
}

const createStoreWithSagaTasks = ({ modules, sagaContext, extensions = [] }: StoreCreatorConfig) => {
  const sagaExtension = getSagaExtension(sagaContext)

  const store = createStore(
    {
      extensions: [sagaExtension, ...extensions],
      advancedCombineReducers: combineReducersWithGlobalActions,
    },
    modules,
  ) as ModuleStoreWithSagaTasks

  store.sagaTasks = sagaExtension.sagaTasks

  return store
}

const getExtensions = (): IExtension[] => {
  const extensions = []

  const loggerExtension = getLoggerExtension()

  if (loggerExtension) {
    extensions.push(loggerExtension)
  }

  return extensions
}

/**
 * `context` живёт только на сервере,
 * `initialState` есть после `getInitialProps`
 */
export const getStore = ({ rootModules = [], pageModules = [] }: GetStoreParams): ModuleStoreWithSagaTasks => {
  if (typeof window === 'undefined') {
    return createStoreWithSagaTasks({ modules: rootModules.concat(pageModules), extensions: getExtensions() })
  }

  // Memoize store if client
  if (!(STOREKEY in window)) {
    window[STOREKEY] = createStoreWithSagaTasks({
      modules: rootModules.concat(pageModules),
      extensions: getExtensions(),
    })
  }

  return window[STOREKEY]
}
