import type { Egg, Extension } from '@redux-eggs/core'
import type { ExtensionEventHandler } from '@redux-eggs/core'
import type { StoreEnhancer } from 'redux'
import type { Saga, SagaMiddleware, SagaMiddlewareOptions } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'

import type { SagaExt } from '@/contracts'
import { getSagaTray } from '@/tray'

export interface SagaExtension extends Extension<any> {
  middlewares: SagaMiddleware[]
  enhancers: StoreEnhancer<SagaExt>[]
  afterAdd: ExtensionEventHandler<any>[]
  afterRemove: ExtensionEventHandler<any>[]
}

const getSagas = (eggs: Egg<any>[]) => {
  return eggs.reduce<Saga[]>((acc, egg) => {
    if (egg.sagas?.length) {
      acc.push(...egg.sagas)
    }
    return acc
  }, [])
}

export const getSagaExtension = (options?: SagaMiddlewareOptions): SagaExtension => {
  const middleware: SagaMiddleware = createSagaMiddleware(options)

  const tray = getSagaTray(middleware)

  const enhancer: StoreEnhancer<SagaExt> = createStore => (reducer, preloadedState) => {
    return Object.assign({}, createStore(reducer, preloadedState), { getSagaTasks: tray.getTasks })
  }

  return {
    middlewares: [middleware],

    enhancers: [enhancer],

    afterAdd: [(eggs: Egg<any>[]): void => tray.add(getSagas(eggs))],

    afterRemove: [(eggs: Egg<any>[]): void => tray.remove(getSagas(eggs))],
  }
}
