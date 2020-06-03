/* eslint-disable default-case */
import produce, { Draft } from 'immer'
import { UsersActionType } from './action-types'
import { usersInitialState, UsersState } from './state'
import { UsersActionsUnion } from './action-creators'

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
