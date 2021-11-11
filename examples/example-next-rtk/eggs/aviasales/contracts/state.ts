import type { AviasalesLoadingState } from '@/eggs/aviasales/contracts/loading-state'
import type { Sort } from '@/eggs/aviasales/contracts/sort'
import type { Ticket } from '@/eggs/aviasales/contracts/ticket'
import type { TicketSegment } from '@/eggs/aviasales/contracts/ticket-sement'
import type { AVIASALES_SLICE } from '@/eggs/aviasales/slice'

export interface AviasalesAwareState {
  [AVIASALES_SLICE]: AviasalesState
}

export interface AviasalesState {
  searchId?: string
  tickets: TicketsMap
  ticketsSegments: TicketsSegmentsMap
  loadingState: AviasalesLoadingState
  currentSort: Sort
  stops: number[]
}

export interface TicketsMap {
  [id: string]: Ticket
}

export interface TicketsSegmentsMap {
  [id: string]: TicketSegment
}
