import { AviasalesLoadingState } from '@/modules/aviasales/contracts/loading-state'
import { Sort } from '@/modules/aviasales/contracts/sort'
import { ActionsUnion, createAction } from '@/store/action-helper'

import { AviasalesActionType } from './action-types'
import { TicketsMap, TicketsSegmentsMap } from './contracts/state'

export const AviasalesReducerAction = {
  setSearchId(payload: string) {
    return createAction(AviasalesActionType.SET_SEARCH_ID, payload)
  },
  addTickets(payload: TicketsMap) {
    return createAction(AviasalesActionType.ADD_TICKETS, payload)
  },
  addTicketsSegments(payload: TicketsSegmentsMap) {
    return createAction(AviasalesActionType.ADD_TICKETS_SEGMENTS, payload)
  },
  setLoadingState(payload: AviasalesLoadingState) {
    return createAction(AviasalesActionType.SET_LOADING_STATE, payload)
  },
  setCurrentSort(payload: Sort) {
    return createAction(AviasalesActionType.SET_CURRENT_SORT, payload)
  },
  setStops(payload: number[]) {
    return createAction(AviasalesActionType.SET_STOPS, payload)
  },
}

export type AviasalesActionsUnion = ActionsUnion<typeof AviasalesReducerAction>
