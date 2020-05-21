import { USERS_MODULE_NAME } from './index'

export enum UsersLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface UsersAwareState {
  [USERS_MODULE_NAME]: UsersState
}

export interface UsersState {
  users?: object
  error?: string
  loadingState: UsersLoadingState
}

export const usersInitialState = {
  loadingState: UsersLoadingState.NEVER,
}
