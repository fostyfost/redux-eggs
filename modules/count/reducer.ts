/* eslint-disable default-case */
import produce, { Draft } from 'immer'

import { CountActionsUnion } from './action-creators'
import { CountActionType } from './action-types'
import { countInitialState, CountState } from './state'

export const countReducer = produce((draft: Draft<CountState>, action: CountActionsUnion): void => {
  switch (action.type) {
    case CountActionType.SET_COUNT:
      draft.count = action.payload
      break
  }
}, countInitialState)
