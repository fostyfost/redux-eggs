/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { ClockActionsUnion } from './action-creators'
import { ClockActionType } from './action-types'
import { ClockState } from './contracts/state'

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
