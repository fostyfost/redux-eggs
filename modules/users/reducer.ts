/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { UsersActionsUnion } from './action-creators'
import { UsersActionType } from './action-types'
import { UsersLoadingState, UsersState } from './contracts/state'

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
