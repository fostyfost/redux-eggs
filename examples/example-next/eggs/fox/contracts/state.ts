import type { Immutable } from 'immer'

import type { FOX_REDUCER_KEY } from '@/eggs/fox/reducer'

export enum FoxLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface FoxAwareState {
  [FOX_REDUCER_KEY]: FoxState
}

export type FoxState = Immutable<{
  fox?: string
  error?: string
  loadingState: FoxLoadingState
}>
