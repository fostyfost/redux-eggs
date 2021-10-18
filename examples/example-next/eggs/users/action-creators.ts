import { UsersActionType } from '@/eggs/users/action-types'
import type { UsersLoadingState } from '@/eggs/users/contracts/state'
import type { User } from '@/eggs/users/contracts/user'
import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

export const UsersPublicAction = {
  loadUsers() {
    return createAction(UsersActionType.LOAD_USERS)
  },
}

export const UsersReducerAction = {
  setUsers(payload: User[]) {
    return createAction(UsersActionType.SET_USERS, payload)
  },
  setError(payload: string | undefined) {
    return createAction(UsersActionType.SET_ERROR, payload)
  },
  setLoadingState(payload: UsersLoadingState) {
    return createAction(UsersActionType.SET_LOADING_STATE, payload)
  },
}

export type UsersActionsUnion = ActionsUnion<typeof UsersReducerAction>
