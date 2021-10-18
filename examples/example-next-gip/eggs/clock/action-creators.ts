import { ClockActionType } from '@/eggs/clock/action-types'
import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

export const ClockPublicAction = {
  startClock() {
    return createAction(ClockActionType.START_CLOCK)
  },
}

export const ClockReducerAction = {
  tickClock(payload: number) {
    return createAction(ClockActionType.TICK_CLOCK, payload)
  },
}

export type ClockActionsUnion = ActionsUnion<typeof ClockReducerAction>
