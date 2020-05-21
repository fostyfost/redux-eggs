/* eslint-disable default-case */
import produce, { Draft } from 'immer'
import { ClockActionType } from './action-types'
import { clockInitialState, ClockState } from './state'
import { HYDRATE, HydrateAction } from '../../store/hydrate-action'
import { CLOCK_MODULE_NAME } from './index'
import { ClockActionsUnion } from './action-creators'

export const clockReducer = produce((draft: Draft<ClockState>, action: ClockActionsUnion | HydrateAction): void => {
  switch (action.type) {
    case HYDRATE:
      if (action.payload[CLOCK_MODULE_NAME]) {
        Object.entries(action.payload[CLOCK_MODULE_NAME]).forEach(([key, value]) => {
          // @ts-ignore
          draft[key] = value
        })
      }
      break

    case ClockActionType.TICK_CLOCK:
      draft.lastUpdate = action.payload
      break
  }
}, clockInitialState)
