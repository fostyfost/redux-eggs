import type { FOX_SLICE } from '@/eggs/fox/slice'

export enum FoxLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface FoxAwareState {
  [FOX_SLICE]: FoxState
}

export interface FoxState {
  fox?: string
  error?: string
  loadingState: FoxLoadingState
}
