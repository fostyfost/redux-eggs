import { COUNT_MODULE_NAME } from './index'

export interface CountAwareState {
  [COUNT_MODULE_NAME]: CountState
}

export interface CountState {
  count: number
}

export const countInitialState = {
  count: 0,
}
