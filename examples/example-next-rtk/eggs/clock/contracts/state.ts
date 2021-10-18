import type { Immutable } from 'immer'

import type { CLOCK_SLICE } from '@/eggs/clock/slice'

export interface ClockAwareState {
  [CLOCK_SLICE]: ClockState
}

export type ClockState = Immutable<{
  lastUpdate: number
}>
