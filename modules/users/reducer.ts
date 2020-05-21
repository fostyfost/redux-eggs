/* eslint-disable default-case */
import produce, { Draft } from 'immer'
import { HYDRATE, HydrateAction } from '../../store/hydrate-action'
import { UsersActionType } from './action-types'
import { usersInitialState, UsersState } from './state'
import { USERS_MODULE_NAME } from './index'
import { UsersActionsUnion } from './action-creators'

export const usersReducer = produce((draft: Draft<UsersState>, action: UsersActionsUnion | HydrateAction): void => {
  switch (action.type) {
    case HYDRATE:
      if (action.payload[USERS_MODULE_NAME]) {
        Object.entries(action.payload[USERS_MODULE_NAME]).forEach(([key, value]) => {
          // @ts-ignore
          draft[key] = value
        })
      }
      break

    case UsersActionType.SET_ERROR:
      draft.error = action.payload
      break

    case UsersActionType.SET_USERS:
      draft.users = action.payload
      break

    case UsersActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break
  }
}, usersInitialState)
