import type { Draft } from 'immer'
import produce from 'immer'

import type { AviasalesActionsUnion } from '@/eggs/aviasales/action-creators'
import { AviasalesActionType } from '@/eggs/aviasales/action-types'
import { DEFAULT_SORT, DEFAULT_STOPS } from '@/eggs/aviasales/constants'
import { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import type { AviasalesState } from '@/eggs/aviasales/contracts/state'

const aviasalesInitialState: AviasalesState = {
  tickets: {},
  ticketsSegments: {},
  loadingState: AviasalesLoadingState.NEVER,
  currentSort: DEFAULT_SORT,
  stops: DEFAULT_STOPS,
}

export const aviasalesReducer = produce((draft: Draft<AviasalesState>, action: AviasalesActionsUnion): void => {
  switch (action.type) {
    case AviasalesActionType.SET_SEARCH_ID:
      draft.searchId = action.payload
      break

    case AviasalesActionType.ADD_TICKETS:
      draft.tickets = Object.assign(draft.tickets, action.payload)
      break

    case AviasalesActionType.ADD_TICKETS_SEGMENTS:
      draft.ticketsSegments = Object.assign(draft.ticketsSegments, action.payload)
      break

    case AviasalesActionType.SET_LOADING_STATE:
      draft.loadingState = action.payload
      break

    case AviasalesActionType.SET_CURRENT_SORT:
      draft.currentSort = action.payload
      break

    case AviasalesActionType.SET_STOPS:
      draft.stops = action.payload
      break
  }
}, aviasalesInitialState)
