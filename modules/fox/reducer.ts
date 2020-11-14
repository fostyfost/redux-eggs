/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { FoxActionsUnion } from './action-creators'
import { FoxActionType } from './action-types'
import { FoxLoadingState, FoxState } from './contracts/state'

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
