import type { CLOCK_SLICE } from '@/eggs/clock/slice'

export interface ClockAwareState {
  [CLOCK_SLICE]: ClockState
}

export interface ClockState {
  lastUpdate: number
}
