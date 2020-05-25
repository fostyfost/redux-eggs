/* eslint-disable default-case */
import produce, { Draft } from 'immer'
import { HYDRATE, HydrateAction } from '../../store/hydrate-action'
import { PicsumActionType } from './action-types'
import { picsumInitialState, PicsumState } from './state'
import { PICSUM_MODULE_NAME } from './index'
import { PicsumActionsUnion } from './action-creators'

export const picsumReducer = produce((draft: Draft<PicsumState>, action: PicsumActionsUnion | HydrateAction): void => {
  switch (action.type) {
    case HYDRATE:
      if (action.payload[PICSUM_MODULE_NAME]) {
        Object.entries(action.payload[PICSUM_MODULE_NAME]).forEach(([key, value]) => {
          // @ts-ignore
          draft[key] = value
        })
      }
      break

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
