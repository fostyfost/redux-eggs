import { Ticket } from '@/modules/aviasales/contracts/ticket'

export interface SearchResponse {
  searchId: string
}

export interface TicketsResponse {
  tickets: Ticket[]
  stop: boolean
}
