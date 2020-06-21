/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { XkcdActionsUnion } from './action-creators'
import { XkcdActionType } from './action-types'
import { xkcdInitialState, XkcdState } from './state'

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
}, xkcdInitialState)
