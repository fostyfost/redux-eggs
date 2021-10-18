import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { UsersAwareState } from '@/eggs/users/contracts/state'
import { UsersLoadingState } from '@/eggs/users/contracts/state'
import type { User } from '@/eggs/users/contracts/user'
import { USERS_REDUCER_KEY } from '@/eggs/users/reducer'

export const usersSelector = (state: UsersAwareState): Immutable<User[]> => {
  return state[USERS_REDUCER_KEY].users
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
  return state[USERS_REDUCER_KEY].error
}

export const loadingStateSelector = (state: UsersAwareState): UsersLoadingState => {
  return state[USERS_REDUCER_KEY].loadingState
}

export const isUsersLoading = createSelector(loadingStateSelector, (loadingState: UsersLoadingState): boolean => {
  return loadingState === UsersLoadingState.LOADING
})

export const isUsersLoaded = createSelector(loadingStateSelector, (loadingState: UsersLoadingState): boolean => {
  return loadingState === UsersLoadingState.LOADED
})
