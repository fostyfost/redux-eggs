import type { CountAwareState } from '@/eggs/count/contracts/state'
import { COUNT_REDUCER_KEY } from '@/eggs/count/reducer'

export const countSelector = (state: CountAwareState): number => {
  return state[COUNT_REDUCER_KEY].count
}
