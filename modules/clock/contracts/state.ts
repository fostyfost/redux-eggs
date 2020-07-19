import { Immutable } from 'immer'

import { CLOCK_MODULE_NAME } from '../index'

export interface ClockAwareState {
  [CLOCK_MODULE_NAME]: ClockState
}

export type ClockState = Immutable<{
  lastUpdate: number
}>
