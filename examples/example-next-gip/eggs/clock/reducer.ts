import type { Draft } from 'immer'
import produce from 'immer'

import type { ClockActionsUnion } from './action-creators'
import { ClockActionType } from './action-types'
import type { ClockState } from './contracts/state'

const clockInitialState = {
  lastUpdate: 0,
}

export const clockReducer = produce((draft: Draft<ClockState>, action: ClockActionsUnion): void => {
  switch (action.type) {
    case ClockActionType.TICK_CLOCK:
      draft.lastUpdate = action.payload
      break
  }
}, clockInitialState)
