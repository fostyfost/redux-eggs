import type { Immutable } from 'immer'

import type { COUNT_SLICE } from '@/eggs/count/slice'

export interface CountAwareState {
  [COUNT_SLICE]: CountState
}

export type CountState = Immutable<{
  count: number
}>
