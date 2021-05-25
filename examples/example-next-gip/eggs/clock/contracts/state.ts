import type { Immutable } from 'immer'

import type { CLOCK_MODULE_NAME } from '../index'

export interface ClockAwareState {
  [CLOCK_MODULE_NAME]: ClockState
}

export type ClockState = Immutable<{
  lastUpdate: number
}>
