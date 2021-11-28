import type { Extension, WithEggExt } from '@redux-eggs/core'
import { buildStore } from '@redux-eggs/core'
import type { AnyAction, EnhancedStore, Store } from '@reduxjs/toolkit'
import { combineReducers, compose, configureStore } from '@reduxjs/toolkit'
import type { EnhancerOptions } from '@reduxjs/toolkit/dist/devtoolsExtension'
import type { CurriedGetDefaultMiddleware, ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

export type DefaultEnhancedStore = EnhancedStore<any, AnyAction, [ThunkMiddlewareFor<any>]>

export interface StoreCreatorOptions {
  combiner?: typeof combineReducers
  defaultMiddlewareOptions?: Parameters<CurriedGetDefaultMiddleware>[0]
  devTools?: boolean | EnhancerOptions
  extensions?: Extension<any>[]
}

export const createStore = <S extends Store = DefaultEnhancedStore>({
  combiner = combineReducers,
  defaultMiddlewareOptions,
  devTools,
  extensions,
}: StoreCreatorOptions = {}): WithEggExt<S> => {
  return buildStore<S>(
    (reducer, middlewareEnhancer, enhancersFromExtensions, middlewaresFromExtensions) => {
      return configureStore({
        reducer,
        devTools,
        enhancers(defaultEnhancers) {
          return [...enhancersFromExtensions, ...defaultEnhancers]
        },
        middleware(getDefaultMiddleware) {
          return getDefaultMiddleware(defaultMiddlewareOptions)
            .prepend(middlewaresFromExtensions)
            .concat(middlewareEnhancer)
        },
      }) as S
    },
    combiner,
    compose,
    extensions,
  )
}
