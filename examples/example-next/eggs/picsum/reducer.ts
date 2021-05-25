import type { Draft } from 'immer'
import produce from 'immer'

import type { PicsumActionsUnion } from './action-creators'
import { PicsumActionType } from './action-types'
import type { PicsumState } from './contracts/state'
import { PicsumLoadingState } from './contracts/state'

const picsumInitialState: PicsumState = {
  loadingState: PicsumLoadingState.NEVER,
}

export const picsumReducer = produce((draft: Draft<PicsumState>, action: PicsumActionsUnion): void => {
  switch (action.type) {
    case PicsumActionType.SET_ERROR:
      draft.error = action.payload
      break

    case PicsumActionType.SET_PICS:
      draft.pics = action.payload
      break

    case PicsumActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, picsumInitialState)
