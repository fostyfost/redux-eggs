import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { XkcdInfo } from '@/eggs/xkcd/contracts/api-response'
import type { XkcdState } from '@/eggs/xkcd/contracts/state'
import { XkcdLoadingState } from '@/eggs/xkcd/contracts/state'

export const XKCD_SLICE = 'xkcd' as const

const initialState: XkcdState = {
  loadingState: XkcdLoadingState.NEVER,
}

const slice = createSlice({
  name: XKCD_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setInfo(state, action: PayloadAction<XkcdInfo | undefined>) {
      state.info = action.payload
    },
    setLoadingState(state, action: PayloadAction<XkcdLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const xkcdReducer = slice.reducer

export const XkcdReducerAction: typeof slice.actions = { ...slice.actions }

export const XkcdPublicAction = {
  loadInfo: createAction(`${XKCD_SLICE}/LOAD_INFO`),
}
