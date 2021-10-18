import type { Draft } from 'immer'
import produce from 'immer'

import type { FoxActionsUnion } from '@/eggs/fox/action-creators'
import { FoxActionType } from '@/eggs/fox/action-types'
import type { FoxState } from '@/eggs/fox/contracts/state'
import { FoxLoadingState } from '@/eggs/fox/contracts/state'

export const FOX_REDUCER_KEY = 'fox' as const

const initialState: FoxState = {
  loadingState: FoxLoadingState.NEVER,
}

export const foxReducer = produce((draft: Draft<FoxState>, action: FoxActionsUnion): void => {
  switch (action.type) {
    case FoxActionType.SET_ERROR:
      draft.error = action.payload
      break

    case FoxActionType.SET_FOX:
      draft.fox = action.payload
      break

    case FoxActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
