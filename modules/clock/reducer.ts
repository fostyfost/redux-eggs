/* eslint-disable default-case */
import produce, { Draft } from 'immer'
import { ClockActionType } from './action-types'
import { clockInitialState, ClockState } from './state'
import { ClockActionsUnion } from './action-creators'

export const clockReducer = produce((draft: Draft<ClockState>, action: ClockActionsUnion): void => {
  switch (action.type) {
    case ClockActionType.TICK_CLOCK:
      draft.lastUpdate = action.payload
      break
  }
}, clockInitialState)
