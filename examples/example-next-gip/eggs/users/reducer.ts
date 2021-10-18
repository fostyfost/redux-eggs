import type { Draft } from 'immer'
import produce from 'immer'

import type { UsersActionsUnion } from '@/eggs/users/action-creators'
import { UsersActionType } from '@/eggs/users/action-types'
import type { UsersState } from '@/eggs/users/contracts/state'
import { UsersLoadingState } from '@/eggs/users/contracts/state'

export const USERS_REDUCER_KEY = 'users' as const

const initialState: UsersState = {
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
}, initialState)
