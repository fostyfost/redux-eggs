import type { Extension } from '@redux-eggs/core'
import { getCore } from '@redux-eggs/core'
import type { Action, AnyAction, Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore as configureStore } from 'redux'

import type { CreateStoreOptions, EggStore } from '@/contracts'

export const createStore = <E extends Extension[] = Extension[], S = any, A extends Action = AnyAction>(
  options?: CreateStoreOptions<[...E]>,
): EggStore<E, S, A> => {
  const { extensions = [], reducerCombiner = combineReducers, enhancersComposer = compose } = options || {}

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

  return configureStore(
    dynamicReducer,
    enhancersComposer(coreEnhancer, ...enhancers, applyMiddleware(dynamicMiddleware, ...middlewares)),
  )
}
