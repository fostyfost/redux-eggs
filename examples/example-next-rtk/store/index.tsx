import { createWrapperInitializer } from '@redux-eggs/next'
import { createStore } from '@redux-eggs/redux-toolkit'
import type { DefaultEnhancedStore } from '@redux-eggs/redux-toolkit/src'
import { getSagaExtension } from '@redux-eggs/saga-extension'
import type { AnyAction, ReducersMapObject } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { batch } from 'react-redux'
import type { EffectMiddleware } from 'redux-saga'
import type { Effect } from 'redux-saga/effects'
import { effectTypes } from 'redux-saga/effects'

import { StoreActionType } from '@/store/action-types'
import { getLoggerExtension } from '@/store/logger-extension'

const combiner = (reducersMap: ReducersMapObject) => {
  const combinedReducer = combineReducers(reducersMap)

  return (state: any = {}, action: AnyAction) => {
    if (action.type === StoreActionType.HYDRATE && action.payload) {
      return combinedReducer({ ...state, ...action.payload }, action)
    }

    return combinedReducer(state, action)
  }
}

const batchAllPuts: EffectMiddleware = next => effect => {
  if (
    effect &&
    effect.type === effectTypes.ALL &&
    Array.isArray(effect.payload) &&
    // To apply batching, there must be only put effects inside `payload`
    !(effect.payload as Effect[]).some(subEffect => subEffect.type !== effectTypes.PUT)
  ) {
    batch(() => next(effect))
    return
  }

  next(effect)
}

const createAppStore = () => {
  return createStore<DefaultEnhancedStore & { test: number }>({
    extensions: [getSagaExtension({ effectMiddlewares: [batchAllPuts] }), getLoggerExtension()],
    combiner,
    devTools: { maxAge: 200 },
  })
}

export type AppStore = ReturnType<typeof createAppStore>

export const wrapperInitializer = createWrapperInitializer<AppStore>(createAppStore, {
  hydrationActionType: StoreActionType.HYDRATE,
})
