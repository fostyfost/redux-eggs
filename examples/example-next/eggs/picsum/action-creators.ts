import { PicsumActionType } from '@/eggs/picsum/action-types'
import type { Picture } from '@/eggs/picsum/contracts/picture'
import type { PicsumLoadingState } from '@/eggs/picsum/contracts/state'
import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

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
