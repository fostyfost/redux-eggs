import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { ClockState } from '@/eggs/clock/contracts/state'

export const CLOCK_SLICE = 'clock' as const

const initialState: ClockState = {
  lastUpdate: 0,
}

const slice = createSlice({
  name: CLOCK_SLICE,
  initialState,
  reducers: {
    tickClock(state, action: PayloadAction<number>) {
      state.lastUpdate = action.payload
    },
  },
})

export const clockReducer = slice.reducer

export const ClockReducerAction: typeof slice.actions = { ...slice.actions }

export const ClockPublicAction = {
  startClock: createAction(`${CLOCK_SLICE}/START_CLOCK`),
}
