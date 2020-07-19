import { Immutable } from 'immer'

import { AVIASALES_MODULE_NAME } from '../index'
import { Ticket } from './ticket'

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
}>

export interface TicketsMap {
  [id: string]: Ticket
}
