import { CLOCK_MODULE_NAME } from '../index'
import { Immutable } from 'immer'

export interface ClockAwareState {
  [CLOCK_MODULE_NAME]: ClockState
}

export type ClockState = Immutable<{
  lastUpdate: number
}>
