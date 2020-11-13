import produce, { Draft } from 'immer'

import { CountActionsUnion } from './action-creators'
import { CountActionType } from './action-types'
import { CountState } from './contracts/state'

const countInitialState: CountState = {
  count: 0,
}

export const countReducer = produce((draft: Draft<CountState>, action: CountActionsUnion): void => {
  if (action.type === CountActionType.SET_COUNT) {
    draft.count = action.payload
  }
}, countInitialState)
