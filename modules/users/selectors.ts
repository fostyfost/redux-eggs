import { Immutable } from 'immer'
import { createSelector } from 'reselect'

import { UsersAwareState, UsersLoadingState } from './contracts/state'
import { User } from './contracts/user'
import { USERS_MODULE_NAME } from './index'

export const usersSelector = (state: UsersAwareState): Immutable<User[]> => {
  return state[USERS_MODULE_NAME].users
}

export const usersIdsSelector = createSelector(usersSelector, users => users.map(user => user.id))

export const usersMapSelector = createSelector(usersSelector, users =>
  users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {} as { [key: string]: User }),
)

export const getUserById = (state: UsersAwareState, id: number): User | undefined => {
  return usersMapSelector(state)[id]
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

export const isUsersLoaded = createSelector(loadingStateSelector, (loadingState: UsersLoadingState): boolean => {
  return loadingState === UsersLoadingState.LOADED
})
