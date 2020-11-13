import { ActionsUnion, createAction } from '@/store/action-helper'

import { UsersActionType } from './action-types'
import { UsersLoadingState } from './contracts/state'
import { User } from './contracts/user'

export const UsersPublicAction = {
  loadUsers: () => createAction(UsersActionType.LOAD_USERS),
}

export const UsersReducerAction = {
  setUsers: (payload: User[]) => createAction(UsersActionType.SET_USERS, payload),
  setError: (payload: string | undefined) => createAction(UsersActionType.SET_ERROR, payload),
  setLoadingState: (payload: UsersLoadingState) => createAction(UsersActionType.SET_LOADING_STATE, payload),
}

export type UsersActionsUnion = ActionsUnion<typeof UsersReducerAction>
