import type { Immutable } from 'immer'

import type { COUNT_REDUCER_KEY } from '@/eggs/count/reducer'

export interface CountAwareState {
  [COUNT_REDUCER_KEY]: CountState
}

export type CountState = Immutable<{
  count: number
}>
