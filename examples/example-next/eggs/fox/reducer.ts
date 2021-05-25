import type { Draft } from 'immer'
import produce from 'immer'

import type { FoxActionsUnion } from './action-creators'
import { FoxActionType } from './action-types'
import type { FoxState } from './contracts/state'
import { FoxLoadingState } from './contracts/state'

const foxInitialState: FoxState = {
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
}, foxInitialState)
