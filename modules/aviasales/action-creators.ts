import { ActionsUnion, createAction } from '@/store/action-helper'

import { AviasalesActionType } from './action-types'
import { AviasalesLoadingState, TicketsMap } from './contracts/state'

export const AviasalesReducerAction = {
  setSearchId: (payload: string) => createAction(AviasalesActionType.SET_SEARCH_ID, payload),
  addTickets: (payload: TicketsMap) => createAction(AviasalesActionType.ADD_TICKETS, payload),
  setLoadingState: (payload: AviasalesLoadingState) => createAction(AviasalesActionType.SET_LOADING_STATE, payload),
}

export type AviasalesActionsUnion = ActionsUnion<typeof AviasalesReducerAction>
