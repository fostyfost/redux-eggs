import { AVIASALES_MODULE_NAME } from './index'
import { AviasalesAwareState, AviasalesLoadingState, TicketsMap } from './contracts/state'
import { Ticket } from './contracts/ticket'
import { Immutable } from 'immer'
import { createSelector } from 'reselect'

export const searchIdSelector = (state: AviasalesAwareState): string | undefined => {
  return state[AVIASALES_MODULE_NAME].searchId
}

export const ticketsSelector = (state: AviasalesAwareState): Immutable<TicketsMap> => {
  return state[AVIASALES_MODULE_NAME].tickets
}

export const ticketsIdsSelector = createSelector(ticketsSelector, (tickets: Immutable<TicketsMap>): string[] =>
  Object.keys(tickets),
)

export const getTicketByIdSelector = (state: AviasalesAwareState, id: string): Immutable<Ticket> | undefined => {
  return state[AVIASALES_MODULE_NAME].tickets[id]
}

export const loadingStateSelector = (state: AviasalesAwareState): AviasalesLoadingState => {
  return state[AVIASALES_MODULE_NAME].loadingState
}

export const isTicketsLoadingSelector = createSelector(
  loadingStateSelector,
  (loadingState: AviasalesLoadingState): boolean => loadingState === AviasalesLoadingState.LOADING,
)

export const isAllTicketLoadedSelector = createSelector(
  loadingStateSelector,
  (loadingState: AviasalesLoadingState): boolean => loadingState === AviasalesLoadingState.LOADED,
)
