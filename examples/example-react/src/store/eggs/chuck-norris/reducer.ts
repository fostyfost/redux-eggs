import type { Draft } from 'immer'
import { produce } from 'immer'

import type { ChuckNorrisActionsUnion } from './action-creators'
import { ChuckNorrisActionType } from './action-types'
import type { ChuckNorrisState } from './contracts/state'
import { ChuckNorrisLoadingState } from './contracts/state'

export const CHUCK_NORRIS_REDUCER_KEY = 'chuck-norris' as const

export const initialState: ChuckNorrisState = {
  loadingState: ChuckNorrisLoadingState.NEVER,
}

export const chuckNorrisReducer = produce((draft: Draft<ChuckNorrisState>, action: ChuckNorrisActionsUnion): void => {
  switch (action.type) {
    case ChuckNorrisActionType.SET_JOKE:
      draft.joke = action.payload
      break

    case ChuckNorrisActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
