/* eslint-disable default-case */
import type { Draft } from 'immer'
import produce from 'immer'

import type { ChuckNorrisActionsUnion } from './action-creators'
import { ChuckNorrisActionType } from './action-types'
import type { ChuckNorrisState } from './contracts/state'
import { ChuckNorrisLoadingState } from './contracts/state'

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
