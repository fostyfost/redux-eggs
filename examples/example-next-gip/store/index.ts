import { composeWithDevTools } from '@redux-devtools/extension'
import { createWrapperInitializer } from '@redux-eggs/next'
import { createStore } from '@redux-eggs/redux'
import { getSagaExtension } from '@redux-eggs/saga-extension'
import { batch } from 'react-redux'
import type { AnyAction, ReducersMapObject } from 'redux'
import { combineReducers } from 'redux'
import type { EffectMiddleware } from 'redux-saga'
import type { Effect } from 'redux-saga/effects'
import { effectTypes } from 'redux-saga/effects'

import { StoreActionType } from '@/store/action-types'
import { getLoggerExtension } from '@/store/logger-extension'

const reducerCombiner = (reducersMap: ReducersMapObject) => {
  const combinedReducer = combineReducers(reducersMap)

  return (state: any = {}, action: AnyAction) => {
    return combinedReducer(action.type === StoreActionType.HYDRATE ? { ...state, ...action.payload } : state, action)
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
  return createStore({
    extensions: [getSagaExtension({ effectMiddlewares: [batchAllPuts] }), getLoggerExtension()],
    reducerCombiner,
    enhancersComposer: composeWithDevTools({ maxAge: 200 }),
  })
}

export type AppStore = ReturnType<typeof createAppStore>

export const wrapperInitializer = createWrapperInitializer(createAppStore, {
  hydrationActionType: StoreActionType.HYDRATE,
})
