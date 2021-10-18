import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { ActivePost, ActivePostState } from '@/eggs/active-post/contracts/state'
import { ActivePostLoadingState } from '@/eggs/active-post/contracts/state'

export const ACTIVE_POST_SLICE = 'active-post' as const

const initialState: ActivePostState = {
  loadingState: ActivePostLoadingState.NEVER,
}

const slice = createSlice({
  name: ACTIVE_POST_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setActivePost(state, action: PayloadAction<ActivePost>) {
      state.activePost = action.payload
    },
    setLoadingState(state, action: PayloadAction<ActivePostLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const activePostReducer = slice.reducer

export const ActivePostReducerAction: typeof slice.actions = { ...slice.actions }

export const ActivePostPublicAction = {
  loadActivePost: createAction<string>(`${ACTIVE_POST_SLICE}/LOAD_ACTIVE_POST`),
}
