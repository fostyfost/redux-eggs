import { ActionsUnion, createAction } from '@/store/action-helper'

import { CountActionType } from './action-types'

export const CountPublicAction = {
  increment() {
    return createAction(CountActionType.INCREMENT)
  },
  decrement() {
    return createAction(CountActionType.DECREMENT)
  },
  reset() {
    return createAction(CountActionType.RESET)
  },
}

export const CountReducerAction = {
  setCount(payload: number) {
    return createAction(CountActionType.SET_COUNT, payload)
  },
}

export type CountActionsUnion = ActionsUnion<typeof CountReducerAction>
