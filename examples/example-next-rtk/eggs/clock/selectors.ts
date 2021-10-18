import type { ClockAwareState } from '@/eggs/clock/contracts/state'
import { CLOCK_SLICE } from '@/eggs/clock/slice'

export const lastUpdateSelector = (state: ClockAwareState): number => {
  return state[CLOCK_SLICE].lastUpdate
}
