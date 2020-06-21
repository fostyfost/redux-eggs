import { ActionsUnion, createAction } from '../../store/action-helper'
import { CountActionType } from './action-types'

export const CountPublicAction = {
  increment: () => createAction(CountActionType.INCREMENT),
  decrement: () => createAction(CountActionType.DECREMENT),
  reset: () => createAction(CountActionType.RESET),
}

export const CountReducerAction = {
  setCount: (payload: number) => createAction(CountActionType.SET_COUNT, payload),
}

export type CountActionsUnion = ActionsUnion<typeof CountReducerAction>
