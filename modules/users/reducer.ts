/* eslint-disable default-case */
import type { Draft } from 'immer'
import produce from 'immer'

import type { UsersActionsUnion } from './action-creators'
import { UsersActionType } from './action-types'
import type { UsersState } from './contracts/state'
import { UsersLoadingState } from './contracts/state'

const usersInitialState: UsersState = {
  users: [],
  loadingState: UsersLoadingState.NEVER,
}

export const usersReducer = produce((draft: Draft<UsersState>, action: UsersActionsUnion): void => {
  switch (action.type) {
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
