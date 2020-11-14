import { Immutable } from 'immer'

import { AVIASALES_MODULE_NAME } from '@/modules/aviasales'
import { Ticket } from '@/modules/aviasales/contracts/ticket'

export enum AviasalesLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface AviasalesAwareState {
  [AVIASALES_MODULE_NAME]: AviasalesState
}

export type AviasalesState = Immutable<{
  searchId?: string
  tickets: TicketsMap
  loadingState: AviasalesLoadingState
  sort: Sort[]
  currentSort: Sort
  stops: number[]
}>

export interface TicketsMap {
  [id: string]: Ticket
}

export enum Sort {
  CHEAPEST = 'CHEAPEST',
  FASTEST = 'FASTEST',
}
