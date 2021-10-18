import type { Immutable } from 'immer'

import type { FOX_SLICE } from '@/eggs/fox/slice'

export enum FoxLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface FoxAwareState {
  [FOX_SLICE]: FoxState
}

export type FoxState = Immutable<{
  fox?: string
  error?: string
  loadingState: FoxLoadingState
}>
