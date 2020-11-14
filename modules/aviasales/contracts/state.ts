import { Immutable } from 'immer'

import { AVIASALES_MODULE_NAME } from '@/modules/aviasales'
import { AviasalesLoadingState } from '@/modules/aviasales/contracts/loading-state'
import { Sort } from '@/modules/aviasales/contracts/sort'
import { Ticket } from '@/modules/aviasales/contracts/ticket'
import { TicketSegment } from '@/modules/aviasales/contracts/ticket-sement'

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
