import { ActionsUnion, createAction } from '../../store/action-helper'
import { XkcdActionType } from './action-types'
import { XkcdLoadingState } from './contracts/state'
import { XkcdInfo } from './contracts/api-response'

export const XkcdPublicAction = {
  loadInfo: () => createAction(XkcdActionType.LOAD_INFO),
}

export const XkcdReducerAction = {
  setInfo: (payload: XkcdInfo | undefined) => createAction(XkcdActionType.SET_INFO, payload),
  setError: (payload: string | undefined) => createAction(XkcdActionType.SET_ERROR, payload),
  setLoadingState: (payload: XkcdLoadingState) => createAction(XkcdActionType.SET_LOADING_STATE, payload),
}

export type XkcdActionsUnion = ActionsUnion<typeof XkcdReducerAction>
