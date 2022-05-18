import type { Egg } from '@redux-eggs/core'
import type { StoreEnhancer } from 'redux'
import type { Saga, SagaMiddlewareOptions } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'

import type { SagaExt, SagaExtension } from '@/contracts'
import { getSagaTray } from '@/tray'

const getSagas = (eggs: Egg[]): Saga[] => {
  return eggs.reduce<Saga[]>((acc, egg) => {
    if (egg.sagas?.length) {
      acc.push(...egg.sagas)
    }
    return acc
  }, [])
}

export const getSagaExtension = <C extends object = {}>(options?: SagaMiddlewareOptions<C>): SagaExtension => {
  const middleware = createSagaMiddleware<C>(options)

  const tray = getSagaTray(middleware)

  const enhancer: StoreEnhancer<SagaExt> = createStore => (reducer, preloadedState) => ({
    ...createStore(reducer, preloadedState),
    getSagaTasks: tray.getTasks,
  })

  return {
    middleware,
    enhancer,
    afterAdd(eggs) {
      tray.add(getSagas(eggs))
    },
    afterRemove(eggs) {
      tray.remove(getSagas(eggs))
    },
  }
}
