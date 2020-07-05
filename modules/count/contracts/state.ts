import { COUNT_MODULE_NAME } from '../index'
import { Immutable } from 'immer'

export interface CountAwareState {
  [COUNT_MODULE_NAME]: CountState
}

export type CountState = Immutable<{
  count: number
}>
