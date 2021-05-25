import type { Draft } from 'immer'
import produce from 'immer'

import type { ActivePostActionsUnion } from './action-creators'
import { ActivePostActionType } from './action-types'
import type { ActivePostState } from './contracts/state'
import { ActivePostLoadingState } from './contracts/state'

const activePostInitialState: ActivePostState = {
  loadingState: ActivePostLoadingState.NEVER,
}

export const activePostReducer = produce((draft: Draft<ActivePostState>, action: ActivePostActionsUnion): void => {
  switch (action.type) {
    case ActivePostActionType.SET_ERROR:
      draft.error = action.payload
      break

    case ActivePostActionType.SET_ACTIVE_POST:
      draft.activePost = action.payload
      break

    case ActivePostActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, activePostInitialState)
