import { CLOCK_MODULE_NAME } from './index'
import { ClockAwareState } from './contracts/state'

export const lastUpdateSelector = (state: ClockAwareState): number => {
  return state[CLOCK_MODULE_NAME].lastUpdate
}
