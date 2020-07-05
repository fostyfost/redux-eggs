import { USERS_MODULE_NAME } from '../index'
import { Immutable } from 'immer'
import { User } from './user'

export enum UsersLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface UsersAwareState {
  [USERS_MODULE_NAME]: UsersState
}

export type UsersState = Immutable<{
  users?: User[]
  error?: string
  loadingState: UsersLoadingState
}>
