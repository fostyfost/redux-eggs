/* eslint-disable default-case */
import produce, { Draft } from 'immer'
import { PicsumActionType } from './action-types'
import { picsumInitialState, PicsumState } from './state'
import { PicsumActionsUnion } from './action-creators'

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
