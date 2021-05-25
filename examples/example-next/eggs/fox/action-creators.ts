import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

import { FoxActionType } from './action-types'
import type { FoxLoadingState } from './contracts/state'

export const FoxPublicAction = {
  loadFox() {
    return createAction(FoxActionType.LOAD_FOX)
  },
}

export const FoxReducerAction = {
  setFox(payload: string) {
    return createAction(FoxActionType.SET_FOX, payload)
  },
  setError(payload: string | undefined) {
    return createAction(FoxActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: FoxLoadingState) {
    return createAction(FoxActionType.SET_LOADING_STATE, payload)
  },
}

export type FoxActionsUnion = ActionsUnion<typeof FoxReducerAction>
