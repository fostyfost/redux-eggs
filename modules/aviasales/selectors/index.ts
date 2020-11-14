import { Immutable } from 'immer'
import { createSelector } from 'redux-views'

import { AVIASALES_MODULE_NAME } from '@/modules/aviasales'
import { AVAILABLE_STOPS, MAX_TICKETS_LENGTH_TO_SHOW } from '@/modules/aviasales/constants'
import { AviasalesLoadingState } from '@/modules/aviasales/contracts/loading-state'
import { Sort } from '@/modules/aviasales/contracts/sort'
import { AviasalesAwareState, TicketsMap } from '@/modules/aviasales/contracts/state'
import { Ticket } from '@/modules/aviasales/contracts/ticket'
import { TicketSegment } from '@/modules/aviasales/contracts/ticket-sement'

export const searchIdSelector = (state: AviasalesAwareState): string | undefined => {
  return state[AVIASALES_MODULE_NAME].searchId
}

export const ticketsSelector = (state: AviasalesAwareState): Immutable<TicketsMap> => {
  return state[AVIASALES_MODULE_NAME].tickets
}

export const currentSortSelector = (state: AviasalesAwareState): Sort => {
  return state[AVIASALES_MODULE_NAME].currentSort
}

export const stopsSelector = (state: AviasalesAwareState): Immutable<number[]> => {
  return state[AVIASALES_MODULE_NAME].stops
}

export const ticketsArraySelector = createSelector(
  [ticketsSelector, stopsSelector, currentSortSelector],
  (tickets: Immutable<TicketsMap>, stops, currentSort: Sort): Immutable<Ticket>[] => {
    let filteredTickets = Object.values(tickets).filter(
      ticket => stops.includes(ticket.stops[0]) && stops.includes(ticket.stops[1]),
    )

    if (currentSort === Sort.CHEAPEST) {
      filteredTickets = filteredTickets.sort((left, right) => left.price - right.price)
    } else if (currentSort === Sort.FASTEST) {
      filteredTickets = filteredTickets.sort((left, right) => left.totalDuration - right.totalDuration)
    }

    return filteredTickets.slice(0, MAX_TICKETS_LENGTH_TO_SHOW)
  },
)

export const ticketsIdsSelector = createSelector([ticketsArraySelector], (tickets: Immutable<Ticket>[]): string[] => {
  return tickets.map(ticket => ticket.id)
})

export const getTicketByIdSelector = (state: AviasalesAwareState, id: string): Immutable<Ticket> | undefined => {
  return state[AVIASALES_MODULE_NAME].tickets[id]
}

export const getTicketSegmentByIdSelector = (
  state: AviasalesAwareState,
  id: string,
): Immutable<TicketSegment> | undefined => {
  return state[AVIASALES_MODULE_NAME].ticketsSegments[id]
}

export const loadingStateSelector = (state: AviasalesAwareState): AviasalesLoadingState => {
  return state[AVIASALES_MODULE_NAME].loadingState
}

export const isTicketsLoadingSelector = createSelector(
  [loadingStateSelector],
  (loadingState: AviasalesLoadingState): boolean => loadingState === AviasalesLoadingState.LOADING,
)

export const isAllTicketLoadedSelector = createSelector(
  [loadingStateSelector],
  (loadingState: AviasalesLoadingState): boolean => loadingState === AviasalesLoadingState.LOADED,
)

const availableStopsAsString = AVAILABLE_STOPS.join(',')

export const isAllStopsSelectedSelector = createSelector([stopsSelector], (stops: Immutable<number[]>): boolean => {
  return [...stops].sort().join(',') === availableStopsAsString
})
