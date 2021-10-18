import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { DEFAULT_SORT, DEFAULT_STOPS } from '@/eggs/aviasales/constants'
import { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import type { Sort } from '@/eggs/aviasales/contracts/sort'
import type { AviasalesState, TicketsMap, TicketsSegmentsMap } from '@/eggs/aviasales/contracts/state'

export const AVIASALES_SLICE = 'aviasales' as const

const initialState: AviasalesState = {
  tickets: {},
  ticketsSegments: {},
  loadingState: AviasalesLoadingState.NEVER,
  currentSort: DEFAULT_SORT,
  stops: DEFAULT_STOPS,
}

const slice = createSlice({
  name: AVIASALES_SLICE,
  initialState,
  reducers: {
    setSearchId(state, action: PayloadAction<string>) {
      state.searchId = action.payload
    },
    addTickets(state, action: PayloadAction<TicketsMap>) {
      state.tickets = Object.assign(state.tickets, action.payload)
    },
    addTicketsSegments(state, action: PayloadAction<TicketsSegmentsMap>) {
      state.ticketsSegments = Object.assign(state.ticketsSegments, action.payload)
    },
    setLoadingState(state, action: PayloadAction<AviasalesLoadingState>) {
      state.loadingState = action.payload
    },
    setCurrentSort(state, action: PayloadAction<Sort>) {
      state.currentSort = action.payload
    },
    setStops(state, action: PayloadAction<number[]>) {
      state.stops = action.payload
    },
  },
})

export const aviasalesReducer = slice.reducer

export const AviasalesReducerAction: typeof slice.actions = { ...slice.actions }
