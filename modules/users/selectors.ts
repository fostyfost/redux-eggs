import { createSelector } from 'reselect'

import { USERS_MODULE_NAME } from './index'
import { UsersAwareState, UsersLoadingState } from './contracts/state'
import { User } from './contracts/user'
import { Immutable } from 'immer'

export const usersSelector = (state: UsersAwareState): Immutable<User[]> | undefined => {
  return state[USERS_MODULE_NAME].users
}

export const errorSelector = (state: UsersAwareState): string | undefined => {
  return state[USERS_MODULE_NAME].error
}

export const loadingStateSelector = (state: UsersAwareState): UsersLoadingState => {
  return state[USERS_MODULE_NAME].loadingState
}

export const isUsersLoading = createSelector(loadingStateSelector, (loadingState: UsersLoadingState): boolean => {
  return loadingState === UsersLoadingState.LOADING
})
