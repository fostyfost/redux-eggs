import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { CountState } from '@/eggs/count/contracts/state'

export const COUNT_SLICE = 'count' as const

const initialState: CountState = {
  count: 0,
}

const slice = createSlice({
  name: COUNT_SLICE,
  initialState,
  reducers: {
    setCount(state, action: PayloadAction<number>) {
      state.count = action.payload
    },
  },
})

export const countReducer = slice.reducer

export const CountReducerAction: typeof slice.actions = { ...slice.actions }

export const CountPublicAction = {
  increment: createAction(`${COUNT_SLICE}/INCREMENT`),
  decrement: createAction(`${COUNT_SLICE}/DECREMENT`),
  reset: createAction(`${COUNT_SLICE}/RESET`),
}
