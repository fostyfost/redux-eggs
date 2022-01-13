import { createSelector } from '@reduxjs/toolkit'

import type { UsersAwareState } from '@/eggs/users/contracts/state'
import { UsersLoadingState } from '@/eggs/users/contracts/state'
import type { User } from '@/eggs/users/contracts/user'
import { USERS_SLICE } from '@/eggs/users/slice'

export const usersSelector = (state: UsersAwareState): User[] => {
  return state[USERS_SLICE].users
}

export const usersIdsSelector = createSelector(usersSelector, users => users.map(user => user.id))

export const usersMapSelector = createSelector(usersSelector, users => {
  return users.reduce<{ [key: string]: User }>((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
})

export const getUserById = (state: UsersAwareState, id: number): User | undefined => {
  return usersMapSelector(state)[id]
}

export const errorSelector = (state: UsersAwareState): string | undefined => {
  return state[USERS_SLICE].error
}

export const loadingStateSelector = (state: UsersAwareState): UsersLoadingState => {
  return state[USERS_SLICE].loadingState
}

export const isUsersLoading = createSelector(
  loadingStateSelector,
  (loadingState: UsersLoadingState): boolean => loadingState === UsersLoadingState.LOADING,
)

export const isUsersLoaded = createSelector(
  loadingStateSelector,
  (loadingState: UsersLoadingState): boolean => loadingState === UsersLoadingState.LOADED,
)
