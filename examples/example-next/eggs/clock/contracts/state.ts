import type { CLOCK_REDUCER_KEY } from '@/eggs/clock/reducer'

export interface ClockAwareState {
  [CLOCK_REDUCER_KEY]: ClockState
}

export interface ClockState {
  lastUpdate: number
}
