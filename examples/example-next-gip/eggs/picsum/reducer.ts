import type { Draft } from 'immer'
import produce from 'immer'

import type { PicsumActionsUnion } from '@/eggs/picsum/action-creators'
import { PicsumActionType } from '@/eggs/picsum/action-types'
import type { PicsumState } from '@/eggs/picsum/contracts/state'
import { PicsumLoadingState } from '@/eggs/picsum/contracts/state'

const initialState: PicsumState = {
  loadingState: PicsumLoadingState.NEVER,
}

export const PICSUM_REDUCER_KEY = 'picsum' as const

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
}, initialState)
