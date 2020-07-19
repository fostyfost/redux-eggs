import { Immutable } from 'immer'

import { COUNT_MODULE_NAME } from '../index'

export interface CountAwareState {
  [COUNT_MODULE_NAME]: CountState
}

export type CountState = Immutable<{
  count: number
}>
