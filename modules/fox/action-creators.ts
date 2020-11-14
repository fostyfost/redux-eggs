import { ActionsUnion, createAction } from '@/store/action-helper'

import { FoxActionType } from './action-types'
import { FoxLoadingState } from './contracts/state'

export const FoxPublicAction = {
  loadFox: () => createAction(FoxActionType.LOAD_FOX),
}

export const FoxReducerAction = {
  setFox: (payload: string) => createAction(FoxActionType.SET_FOX, payload),
  setError: (payload: string | undefined) => createAction(FoxActionType.SET_ERROR, payload),
  setLoadingState: (payload: FoxLoadingState) => createAction(FoxActionType.SET_LOADING_STATE, payload),
}

export type FoxActionsUnion = ActionsUnion<typeof FoxReducerAction>
