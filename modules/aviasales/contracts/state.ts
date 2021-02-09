import type { Immutable } from 'immer'

import type { AVIASALES_MODULE_NAME } from '@/modules/aviasales'
import type { AviasalesLoadingState } from '@/modules/aviasales/contracts/loading-state'
import type { Sort } from '@/modules/aviasales/contracts/sort'
import type { Ticket } from '@/modules/aviasales/contracts/ticket'
import type { TicketSegment } from '@/modules/aviasales/contracts/ticket-sement'

export interface AviasalesAwareState {
  [AVIASALES_MODULE_NAME]: AviasalesState
}

export type AviasalesState = Immutable<{
  searchId?: string
  tickets: TicketsMap
  ticketsSegments: TicketsSegmentsMap
  loadingState: AviasalesLoadingState
  currentSort: Sort
  stops: number[]
}>

export interface TicketsMap {
  [id: string]: Ticket
}

export interface TicketsSegmentsMap {
  [id: string]: TicketSegment
}
