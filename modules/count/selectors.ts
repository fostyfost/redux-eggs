import { CountAwareState } from './contracts/state'
import { COUNT_MODULE_NAME } from './index'

export const countSelector = (state: CountAwareState): number => {
  return state[COUNT_MODULE_NAME].count
}
