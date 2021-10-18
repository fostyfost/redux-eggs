import type { Immutable } from 'immer'
import { createSelector } from 'redux-views'

import { AVAILABLE_STOPS, MAX_TICKETS_LENGTH_TO_SHOW } from '@/eggs/aviasales/constants'
import { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import { Sort } from '@/eggs/aviasales/contracts/sort'
import type { AviasalesAwareState, TicketsMap } from '@/eggs/aviasales/contracts/state'
import type { Ticket } from '@/eggs/aviasales/contracts/ticket'
import type { TicketSegment } from '@/eggs/aviasales/contracts/ticket-sement'
import { AVIASALES_SLICE } from '@/eggs/aviasales/slice'

export const searchIdSelector = (state: AviasalesAwareState): string | undefined => {
  return state[AVIASALES_SLICE].searchId
}

export const ticketsSelector = (state: AviasalesAwareState): Immutable<TicketsMap> => {
  return state[AVIASALES_SLICE].tickets
}

export const currentSortSelector = (state: AviasalesAwareState): Sort => {
  return state[AVIASALES_SLICE].currentSort
}

export const stopsSelector = (state: AviasalesAwareState): Immutable<number[]> => {
  return state[AVIASALES_SLICE].stops
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
  return state[AVIASALES_SLICE].tickets[id]
}

export const getTicketSegmentByIdSelector = (
  state: AviasalesAwareState,
  id: string,
): Immutable<TicketSegment> | undefined => {
  return state[AVIASALES_SLICE].ticketsSegments[id]
}

export const loadingStateSelector = (state: AviasalesAwareState): AviasalesLoadingState => {
  return state[AVIASALES_SLICE].loadingState
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
