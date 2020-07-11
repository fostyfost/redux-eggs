import { Ticket } from './ticket'

export interface SearchResponse {
  searchId: string
}

export interface TicketsResponse {
  tickets: Ticket[]
  stop: boolean
}
