import { UsersActionType } from './action-types'
import { ActionsUnion, createAction } from '../../store/action-helper'
import { UsersLoadingState } from './state'

export const UsersPublicAction = {
  loadUsers: () => createAction(UsersActionType.LOAD_USERS),
}

export const UsersReducerAction = {
  setUsers: (payload: any) => createAction(UsersActionType.SET_USERS, payload),
  setError: (payload: string) => createAction(UsersActionType.SET_ERROR, payload),
  setLoadingState: (payload: UsersLoadingState) => createAction(UsersActionType.SET_LOADING_STATE, payload),
}

export type UsersActionsUnion = ActionsUnion<typeof UsersReducerAction>
