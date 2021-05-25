import type { Immutable } from 'immer'

import type { COUNT_MODULE_NAME } from '../index'

export interface CountAwareState {
  [COUNT_MODULE_NAME]: CountState
}

export type CountState = Immutable<{
  count: number
}>
