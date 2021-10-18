import type { Draft } from 'immer'
import produce from 'immer'

import type { CountActionsUnion } from '@/eggs/count/action-creators'
import { CountActionType } from '@/eggs/count/action-types'
import type { CountState } from '@/eggs/count/contracts/state'

const initialState: CountState = {
  count: 0,
}

export const COUNT_REDUCER_KEY = 'count' as const

export const countReducer = produce((draft: Draft<CountState>, action: CountActionsUnion): void => {
  if (action.type === CountActionType.SET_COUNT) {
    draft.count = action.payload
  }
}, initialState)
