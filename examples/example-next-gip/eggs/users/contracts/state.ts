import type { Immutable } from 'immer'

import type { User } from '@/eggs/users/contracts/user'
import type { USERS_REDUCER_KEY } from '@/eggs/users/reducer'

export enum UsersLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface UsersAwareState {
  [USERS_REDUCER_KEY]: UsersState
}

export type UsersState = Immutable<{
  users: User[]
  error?: string
  loadingState: UsersLoadingState
}>
