import { ClockAwareState } from './contracts/state'
import { CLOCK_MODULE_NAME } from './index'

export const lastUpdateSelector = (state: ClockAwareState): number => {
  return state[CLOCK_MODULE_NAME].lastUpdate
}
