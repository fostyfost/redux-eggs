import { XkcdActionType } from './action-types'
import { ActionsUnion, createAction } from '../../store/action-helper'
import { XkcdInfo, XkcdLoadingState } from './state'

export const XkcdPublicAction = {
  loadInfo: () => createAction(XkcdActionType.LOAD_INFO),
}

export const XkcdReducerAction = {
  setInfo: (payload: XkcdInfo | undefined) => createAction(XkcdActionType.SET_INFO, payload),
  setError: (payload: string | undefined) => createAction(XkcdActionType.SET_ERROR, payload),
  setLoadingState: (payload: XkcdLoadingState) => createAction(XkcdActionType.SET_LOADING_STATE, payload),
}

export type XkcdActionsUnion = ActionsUnion<typeof XkcdReducerAction>
