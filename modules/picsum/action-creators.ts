import { ActionsUnion, createAction } from '@/store/action-helper'

import { PicsumActionType } from './action-types'
import { Picture } from './contracts/picture'
import { PicsumLoadingState } from './contracts/state'

export const PicsumPublicAction = {
  loadPics() {
    return createAction(PicsumActionType.LOAD_PICS)
  },
}

export const PicsumReducerAction = {
  setPics(payload: Picture[]) {
    return createAction(PicsumActionType.SET_PICS, payload)
  },
  setError(payload: string | undefined) {
    return createAction(PicsumActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: PicsumLoadingState) {
    return createAction(PicsumActionType.SET_LOADING_STATE, payload)
  },
}

export type PicsumActionsUnion = ActionsUnion<typeof PicsumReducerAction>
