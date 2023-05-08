import type { Draft } from 'immer'
import { produce } from 'immer'

import type { XkcdActionsUnion } from '@/eggs/xkcd/action-creators'
import { XkcdActionType } from '@/eggs/xkcd/action-types'
import type { XkcdState } from '@/eggs/xkcd/contracts/state'
import { XkcdLoadingState } from '@/eggs/xkcd/contracts/state'

export const XKCD_REDUCER_KEY = 'xkcd' as const

const initialState: XkcdState = {
  loadingState: XkcdLoadingState.NEVER,
}

export const xkcdReducer = produce((draft: Draft<XkcdState>, action: XkcdActionsUnion): void => {
  switch (action.type) {
    case XkcdActionType.SET_ERROR:
      draft.error = action.payload
      break

    case XkcdActionType.SET_INFO:
      draft.info = action.payload
      break

    case XkcdActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, initialState)
