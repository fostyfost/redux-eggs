import type { COUNT_SLICE } from '@/eggs/count/slice'

export interface CountAwareState {
  [COUNT_SLICE]: CountState
}

export interface CountState {
  count: number
}
