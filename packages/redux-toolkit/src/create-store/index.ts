import type { Extension } from '@redux-eggs/core'
import { getCore } from '@redux-eggs/core'
import type { Action, AnyAction, Middleware, Store } from '@reduxjs/toolkit'
import { combineReducers, compose, configureStore } from '@reduxjs/toolkit'
import type { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

import type { CreateStoreOptions, EggStore } from '@/contracts'

export const createStore = <
  E extends Extension[] = Extension[],
  S = any,
  A extends Action = AnyAction,
  M extends Middleware[] = [ThunkMiddlewareFor<S>],
>(
  options?: CreateStoreOptions<[...E], S, M>,
): EggStore<E, S, A, M> => {
  const { extensions = [], reducerCombiner = combineReducers, middleware: optionsMiddlewares, devTools } = options || {}

  const { dynamicReducer, dynamicMiddleware, coreEnhancer, middlewares, enhancers } = getCore<Store>(
    reducerCombiner,
    compose,
    (store, method, reducersEntries) => {
      store.dispatch({
        type: '@@eggs/reduce',
        payload: {
          method,
          reducers: reducersEntries.map(entry => entry[0]),
        },
      })
    },
    extensions,
  )

  // TODO: Types fixed in https://github.com/reduxjs/redux-toolkit/pull/2550
  return configureStore({
    reducer: dynamicReducer,
    middleware(getDefaultMiddleware) {
      let defaultMiddlewares: ReadonlyArray<Middleware> = []

      if (typeof optionsMiddlewares === 'function') {
        defaultMiddlewares = optionsMiddlewares(getDefaultMiddleware)
      } else if (Array.isArray(optionsMiddlewares)) {
        defaultMiddlewares = optionsMiddlewares
      } else {
        defaultMiddlewares = getDefaultMiddleware()
      }

      return [dynamicMiddleware, ...defaultMiddlewares, ...middlewares]
    },
    enhancers(defaultEnhancers) {
      return [coreEnhancer, ...defaultEnhancers, ...enhancers]
    },
    devTools,
  }) as EggStore<E, S, A, M>
}
