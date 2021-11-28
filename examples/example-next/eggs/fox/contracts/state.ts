import type { FOX_REDUCER_KEY } from '@/eggs/fox/reducer'

export enum FoxLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface FoxAwareState {
  [FOX_REDUCER_KEY]: FoxState
}

export interface FoxState {
  fox?: string
  error?: string
  loadingState: FoxLoadingState
}
