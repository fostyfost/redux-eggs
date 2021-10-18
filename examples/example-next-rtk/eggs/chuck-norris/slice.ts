import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { ChuckNorrisState } from '@/eggs/chuck-norris/contracts/state'
import { ChuckNorrisLoadingState } from '@/eggs/chuck-norris/contracts/state'

export const CHUCK_NORRIS_SLICE = 'chuck-norris' as const

const initialState: ChuckNorrisState = {
  loadingState: ChuckNorrisLoadingState.NEVER,
}

const slice = createSlice({
  name: CHUCK_NORRIS_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setJoke(state, action: PayloadAction<string>) {
      state.joke = action.payload
    },
    setLoadingState(state, action: PayloadAction<ChuckNorrisLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const chuckNorrisReducer = slice.reducer

export const ChuckNorrisReducerAction: typeof slice.actions = { ...slice.actions }

export const ChuckNorrisPublicAction = {
  loadJoke: createAction(`${CHUCK_NORRIS_SLICE}/LOAD_JOKE`),
}
