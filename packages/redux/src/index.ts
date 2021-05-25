import type { EggExt, Extension } from '@redux-eggs/core'
import { buildStore } from '@redux-eggs/core'
import type { Store } from 'redux'
import { applyMiddleware, combineReducers, compose, createStore as createReduxStore } from 'redux'

export * from '@redux-eggs/core'

export type StoreWithEggs<Ext = Record<string, never>> = Store & EggExt & Ext

export interface StoreCreatorOptions {
  combiner?: typeof combineReducers
  composer?: typeof compose
  extensions?: Extension[]
}

export const createStore = <S extends Store = Store>({
  combiner = combineReducers,
  composer = compose,
  extensions,
}: StoreCreatorOptions = {}): S & EggExt => {
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
