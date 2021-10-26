import type { EggExt, Extension } from '@redux-eggs/core'
import { buildStore } from '@redux-eggs/core'
import type { EnhancedStore } from '@reduxjs/toolkit'
import { combineReducers, compose, configureStore } from '@reduxjs/toolkit'
import type { EnhancerOptions } from '@reduxjs/toolkit/dist/devtoolsExtension'
import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

export type StoreWithEggs<Ext = Record<string, never>> = EnhancedStore & EggExt & Ext

export interface StoreCreatorSettings {
  combiner?: typeof combineReducers
  defaultMiddlewareOptions?: Parameters<CurriedGetDefaultMiddleware>[0]
  devTools?: boolean | EnhancerOptions
  extensions?: Extension[]
}

export const createStore = <S extends EnhancedStore = EnhancedStore>({
  combiner = combineReducers,
  defaultMiddlewareOptions,
  devTools,
  extensions,
}: StoreCreatorSettings = {}): S & EggExt => {
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
