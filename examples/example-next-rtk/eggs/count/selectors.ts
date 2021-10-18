import type { CountAwareState } from '@/eggs/count/contracts/state'
import { COUNT_SLICE } from '@/eggs/count/slice'

export const countSelector = (state: CountAwareState): number => {
  return state[COUNT_SLICE].count
}
