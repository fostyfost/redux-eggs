import type { Draft } from 'immer'
import produce from 'immer'

import type { DogActionsUnion } from './action-creators'
import { DogActionType } from './action-types'
import type { DogState } from './contracts/state'
import { DogLoadingState } from './contracts/state'

export const DOG_REDUCER_KEY = 'dog' as const

export const initialState: DogState = {
  loadingState: DogLoadingState.NEVER,
}

export const dogReducer = produce((draft: Draft<DogState>, action: DogActionsUnion): void => {
  switch (action.type) {
    case DogActionType.SET_DOG:
      draft.dog = action.payload
      break

    case DogActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
