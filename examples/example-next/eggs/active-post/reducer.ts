import type { Draft } from 'immer'
import { produce } from 'immer'

import type { ActivePostActionsUnion } from '@/eggs/active-post/action-creators'
import { ActivePostActionType } from '@/eggs/active-post/action-types'
import type { ActivePostState } from '@/eggs/active-post/contracts/state'
import { ActivePostLoadingState } from '@/eggs/active-post/contracts/state'

export const ACTIVE_POST_REDUCER_KEY = 'active-post' as const

const initialState: ActivePostState = {
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
}, initialState)
