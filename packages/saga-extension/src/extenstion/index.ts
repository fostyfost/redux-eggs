import type { Egg, Extension, ExtensionEventHandler } from '@redux-eggs/core'
import type { StoreEnhancer } from 'redux'
import type { Saga, SagaMiddleware, SagaMiddlewareOptions } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'

import type { SagaExt } from '@/contracts'
import { getSagaTray } from '@/tray'

export interface SagaExtension extends Extension {
  middlewares: [SagaMiddleware]
  enhancers: [StoreEnhancer<SagaExt>]
  afterAdd: [ExtensionEventHandler]
  afterRemove: [ExtensionEventHandler]
}

export type GetSagaExtension = (options?: SagaMiddlewareOptions) => SagaExtension

const getSagas = (eggs: Egg[]) => {
  return eggs.reduce((acc, egg) => {
    if (egg.sagas?.length) {
      acc.push(...egg.sagas)
    }
    return acc
  }, [] as Saga[])
}

export const getSagaExtension: GetSagaExtension = options => {
  const middleware = createSagaMiddleware(options)

  const tray = getSagaTray(middleware)

  const enhancer: StoreEnhancer<SagaExt> = createStore => (reducer, preloadedState) => {
    return Object.assign({}, createStore(reducer, preloadedState), { getSagaTasks: tray.getTasks })
  }

  return {
    middlewares: [middleware],

    enhancers: [enhancer],

    afterAdd: [(eggs: Egg[]): void => tray.add(getSagas(eggs))],

    afterRemove: [(eggs: Egg[]): void => tray.remove(getSagas(eggs))],
  }
}
