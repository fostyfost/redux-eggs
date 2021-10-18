import { FoxActionType } from '@/eggs/fox/action-types'
import type { FoxLoadingState } from '@/eggs/fox/contracts/state'
import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

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
