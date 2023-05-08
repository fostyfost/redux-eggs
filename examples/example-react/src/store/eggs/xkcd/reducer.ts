import type { Draft } from 'immer'
import { produce } from 'immer'

import type { XkcdActionsUnion } from './action-creators'
import { XkcdActionType } from './action-types'
import type { XkcdState } from './contracts/state'
import { XkcdLoadingState } from './contracts/state'

export const XKCD_REDUCER_KEY = 'xkcd' as const

export const initialState: XkcdState = {
  loadingState: XkcdLoadingState.NEVER,
}

export const xkcdReducer = produce((draft: Draft<XkcdState>, action: XkcdActionsUnion): void => {
  switch (action.type) {
    case XkcdActionType.SET_INFO:
      draft.info = action.payload
      break

    case XkcdActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
