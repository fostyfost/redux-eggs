import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

import { XkcdActionType } from './action-types'
import type { XkcdInfo } from './contracts/api-response'
import type { XkcdLoadingState } from './contracts/state'

export const XkcdPublicAction = {
  loadInfo() {
    return createAction(XkcdActionType.LOAD_INFO)
  },
}

export const XkcdReducerAction = {
  setInfo(payload: XkcdInfo | undefined) {
    return createAction(XkcdActionType.SET_INFO, payload)
  },
  setError(payload: string | undefined) {
    return createAction(XkcdActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: XkcdLoadingState) {
    return createAction(XkcdActionType.SET_LOADING_STATE, payload)
  },
}

export type XkcdActionsUnion = ActionsUnion<typeof XkcdReducerAction>
