import { ActionsUnion, createAction } from '../../store/action-helper'
import { PicsumActionType } from './action-types'
import { PicsumLoadingState } from './state'

export const PicsumPublicAction = {
  loadPics: () => createAction(PicsumActionType.LOAD_PICS),
}

export const PicsumReducerAction = {
  setPics: (payload: any) => createAction(PicsumActionType.SET_PICS, payload),
  setError: (payload: string) => createAction(PicsumActionType.SET_ERROR, payload),
  setLoadingState: (payload: PicsumLoadingState) => createAction(PicsumActionType.SET_LOADING_STATE, payload),
}

export type PicsumActionsUnion = ActionsUnion<typeof PicsumReducerAction>
