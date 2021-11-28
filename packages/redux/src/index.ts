import type { Extension, WithEggExt } from '@redux-eggs/core'
import { buildStore } from '@redux-eggs/core'
import type { Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore as createReduxStore } from 'redux'

export interface StoreCreatorOptions {
  combiner?: typeof combineReducers
  composer?: typeof compose
  extensions?: Extension<any>[]
}

export const createStore = <S extends Store = Store>({
  combiner = combineReducers,
  composer = compose,
  extensions,
}: StoreCreatorOptions = {}): WithEggExt<S> => {
  return buildStore<S>(
    (reducer, middlewareEnhancer, enhancersFromExtensions, middlewaresFromExtensions) => {
      return createReduxStore(
        reducer,
        composer(...enhancersFromExtensions, applyMiddleware(...middlewaresFromExtensions, middlewareEnhancer)),
      )
    },
    combiner,
    compose,
    extensions,
  )
}
