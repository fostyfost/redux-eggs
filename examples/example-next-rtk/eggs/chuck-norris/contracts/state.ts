import type { CHUCK_NORRIS_SLICE } from '@/eggs/chuck-norris/slice'

export enum ChuckNorrisLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ChuckNorrisAwareState {
  [CHUCK_NORRIS_SLICE]: ChuckNorrisState
}

export interface ChuckNorrisState {
  joke?: string
  error?: string
  loadingState: ChuckNorrisLoadingState
}
