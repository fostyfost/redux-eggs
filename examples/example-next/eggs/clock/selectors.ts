import type { ClockAwareState } from '@/eggs/clock/contracts/state'
import { CLOCK_REDUCER_KEY } from '@/eggs/clock/reducer'

export const lastUpdateSelector = (state: ClockAwareState): number => {
  return state[CLOCK_REDUCER_KEY].lastUpdate
}
