import type { Draft } from 'immer'
import produce from 'immer'

import type { DogActionsUnion } from '@/eggs/dog/action-creators'
import { DogActionType } from '@/eggs/dog/action-types'
import type { DogState } from '@/eggs/dog/contracts/state'
import { DogLoadingState } from '@/eggs/dog/contracts/state'

const initialState: DogState = {
  loadingState: DogLoadingState.NEVER,
}

export const DOG_REDUCER_KEY = 'dog' as const

export const dogReducer = produce((draft: Draft<DogState>, action: DogActionsUnion): void => {
  switch (action.type) {
    case DogActionType.SET_ERROR:
      draft.error = action.payload
      break

    case DogActionType.SET_DOG:
      draft.dog = action.payload
      break

    case DogActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
