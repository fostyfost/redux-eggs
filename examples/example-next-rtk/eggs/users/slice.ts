import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { UsersState } from '@/eggs/users/contracts/state'
import { UsersLoadingState } from '@/eggs/users/contracts/state'
import type { User } from '@/eggs/users/contracts/user'

export const USERS_SLICE = 'users' as const

const initialState: UsersState = {
  users: [],
  loadingState: UsersLoadingState.NEVER,
}

const slice = createSlice({
  name: USERS_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload
    },
    setLoadingState(state, action: PayloadAction<UsersLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const usersReducer = slice.reducer

export const UsersReducerAction: typeof slice.actions = { ...slice.actions }

export const UsersPublicAction = {
  loadUsers: createAction(`${USERS_SLICE}/LOAD_USERS`),
}
