import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

import { ActivePostActionType } from './action-types'
import type { ActivePostLoadingState } from './contracts/state'
import type { ActivePost } from './contracts/state'

export const ActivePostPublicAction = {
  loadActivePost(payload: string) {
    return createAction(ActivePostActionType.LOAD_ACTIVE_POST, payload)
  },
}

export const ActivePostReducerAction = {
  setActivePost(payload: ActivePost) {
    return createAction(ActivePostActionType.SET_ACTIVE_POST, payload)
  },
  setError(payload: string | undefined) {
    return createAction(ActivePostActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: ActivePostLoadingState) {
    return createAction(ActivePostActionType.SET_LOADING_STATE, payload)
  },
}

export type ActivePostActionsUnion = ActionsUnion<typeof ActivePostReducerAction>
