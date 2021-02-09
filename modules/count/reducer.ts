import type { Draft } from 'immer'
import produce from 'immer'

import type { CountActionsUnion } from './action-creators'
import { CountActionType } from './action-types'
import type { CountState } from './contracts/state'

const countInitialState: CountState = {
  count: 0,
}

export const countReducer = produce((draft: Draft<CountState>, action: CountActionsUnion): void => {
  if (action.type === CountActionType.SET_COUNT) {
    draft.count = action.payload
  }
}, countInitialState)
