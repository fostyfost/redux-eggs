import type { ActionsUnion } from '@/store/action-helper'
import { createAction } from '@/store/action-helper'

import { ClockActionType } from './action-types'

export const ClockPublicAction = {
  startClock() {
    return createAction(ClockActionType.START_CLOCK)
  },
}

export const ClockReducerAction = {
  tickClock() {
    return createAction(ClockActionType.TICK_CLOCK, Date.now())
  },
}

export type ClockActionsUnion = ActionsUnion<typeof ClockReducerAction>
