import { CLOCK_MODULE_NAME } from './index'

export interface ClockAwareState {
  [CLOCK_MODULE_NAME]: ClockState
}

export interface ClockState {
  lastUpdate: number
}

export const clockInitialState = {
  lastUpdate: 0,
}
