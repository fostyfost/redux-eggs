import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { DogState } from '@/eggs/dog/contracts/state'
import { DogLoadingState } from '@/eggs/dog/contracts/state'

export const DOG_SLICE = 'dog' as const

const initialState: DogState = {
  loadingState: DogLoadingState.NEVER,
}

const slice = createSlice({
  name: DOG_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setDog(state, action: PayloadAction<string>) {
      state.dog = action.payload
    },
    setLoadingState(state, action: PayloadAction<DogLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const dogReducer = slice.reducer

export const DogReducerAction: typeof slice.actions = { ...slice.actions }

export const DogPublicAction = {
  loadDog: createAction(`${DOG_SLICE}/LOAD_DOG`),
}
