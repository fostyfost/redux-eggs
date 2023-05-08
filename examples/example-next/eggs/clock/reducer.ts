import type { Draft } from 'immer'
import { produce } from 'immer'

import type { ClockActionsUnion } from '@/eggs/clock/action-creators'
import { ClockActionType } from '@/eggs/clock/action-types'
import type { ClockState } from '@/eggs/clock/contracts/state'

export const CLOCK_REDUCER_KEY = 'clock' as const

const initialState: ClockState = {
  lastUpdate: 0,
}

export const clockReducer = produce((draft: Draft<ClockState>, action: ClockActionsUnion): void => {
  switch (action.type) {
    case ClockActionType.TICK_CLOCK:
      draft.lastUpdate = action.payload
      break
  }
}, initialState)
