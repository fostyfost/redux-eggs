import type { Draft } from 'immer'
import produce from 'immer'

import type { ChuckNorrisActionsUnion } from '@/eggs/chuck-norris/action-creators'
import { ChuckNorrisActionType } from '@/eggs/chuck-norris/action-types'
import type { ChuckNorrisState } from '@/eggs/chuck-norris/contracts/state'
import { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'

const initialState: ChuckNorrisState = {
  loadingState: ChuckNorrisLoadingState.NEVER,
}

export const CHUCK_NORRIS_REDUCER_KEY = 'chuck-norris' as const

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
}, initialState)
