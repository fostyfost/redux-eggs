import { ActionsUnion, createAction } from '@/store/action-helper'

import { AviasalesActionType } from './action-types'
import { AviasalesLoadingState, Sort, TicketsMap } from './contracts/state'

export const AviasalesPublicAction = {
  getTickets(payload: { sort: Sort; stops: number[] }) {
    return createAction(AviasalesActionType.GET_TICKETS, payload)
  },
}

export const AviasalesReducerAction = {
  setSearchId(payload: string) {
    return createAction(AviasalesActionType.SET_SEARCH_ID, payload)
  },
  addTickets(payload: TicketsMap) {
    return createAction(AviasalesActionType.ADD_TICKETS, payload)
  },
  setLoadingState(payload: AviasalesLoadingState) {
    return createAction(AviasalesActionType.SET_LOADING_STATE, payload)
  },
  setSort(payload: Sort) {
    return createAction(AviasalesActionType.SET_SORT, payload)
  },
  setStops(payload: number[]) {
    return createAction(AviasalesActionType.SET_STOPS, payload)
  },
}

export type AviasalesActionsUnion = ActionsUnion<typeof AviasalesReducerAction>
