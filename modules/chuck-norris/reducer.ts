/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { ChuckNorrisActionsUnion } from './action-creators'
import { ChuckNorrisActionType } from './action-types'
import { ChuckNorrisLoadingState, ChuckNorrisState } from './contracts/state'

const chuckNorrisInitialState: ChuckNorrisState = {
  loadingState: ChuckNorrisLoadingState.NEVER,
}

export const chuckNorrisReducer = produce((draft: Draft<ChuckNorrisState>, action: ChuckNorrisActionsUnion): void => {
  switch (action.type) {
    case ChuckNorrisActionType.SET_ERROR:
      draft.error = action.payload
      break

    case ChuckNorrisActionType.SET_JOKE:
      draft.joke = action.payload
      break

    case ChuckNorrisActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, chuckNorrisInitialState)
