/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { ClockActionsUnion } from './action-creators'
import { ClockActionType } from './action-types'
import { clockInitialState, ClockState } from './state'

export const clockReducer = produce((draft: Draft<ClockState>, action: ClockActionsUnion): void => {
  switch (action.type) {
    case ClockActionType.TICK_CLOCK:
      draft.lastUpdate = action.payload
      break
  }
}, clockInitialState)
