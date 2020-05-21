import { ClockActionType } from './action-types'
import { ActionsUnion, createAction } from '../../store/action-helper'

export const ClockPublicAction = {
  startClock: () => createAction(ClockActionType.START_CLOCK),
}

export const ClockReducerAction = {
  tickClock: () => createAction(ClockActionType.TICK_CLOCK, Date.now()),
}

export type ClockActionsUnion = ActionsUnion<typeof ClockReducerAction>
