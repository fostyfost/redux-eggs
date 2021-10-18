import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { FoxState } from '@/eggs/fox/contracts/state'
import { FoxLoadingState } from '@/eggs/fox/contracts/state'

export const FOX_SLICE = 'fox' as const

const initialState: FoxState = {
  loadingState: FoxLoadingState.NEVER,
}

const slice = createSlice({
  name: FOX_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setFox(state, action: PayloadAction<string>) {
      state.fox = action.payload
    },
    setLoadingState(state, action: PayloadAction<FoxLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const foxReducer = slice.reducer

export const FoxReducerAction: typeof slice.actions = { ...slice.actions }

export const FoxPublicAction = {
  loadFox: createAction(`${FOX_SLICE}/LOAD_FOX`),
}
