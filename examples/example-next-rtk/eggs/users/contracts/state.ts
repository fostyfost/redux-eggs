import type { User } from '@/eggs/users/contracts/user'
import type { USERS_SLICE } from '@/eggs/users/slice'

export enum UsersLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface UsersAwareState {
  [USERS_SLICE]: UsersState
}

export interface UsersState {
  users: User[]
  error?: string
  loadingState: UsersLoadingState
}
