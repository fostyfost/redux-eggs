import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { Picture } from '@/eggs/picsum/contracts/picture'
import type { PicsumState } from '@/eggs/picsum/contracts/state'
import { PicsumLoadingState } from '@/eggs/picsum/contracts/state'

export const PICSUM_SLICE = 'picsum' as const

const initialState: PicsumState = {
  loadingState: PicsumLoadingState.NEVER,
}

const slice = createSlice({
  name: PICSUM_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setPics(state, action: PayloadAction<Picture[]>) {
      state.pics = action.payload
    },
    setLoadingState(state, action: PayloadAction<PicsumLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const picsumReducer = slice.reducer

export const PicsumReducerAction: typeof slice.actions = { ...slice.actions }

export const PicsumPublicAction = {
  loadPics: createAction(`${PICSUM_SLICE}/LOAD_PICS`),
}
