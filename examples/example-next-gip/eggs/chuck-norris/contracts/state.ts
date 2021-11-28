import type { CHUCK_NORRIS_REDUCER_KEY } from '@/eggs/chuck-norris/reducer'

export enum ChuckNorrisLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ChuckNorrisAwareState {
  [CHUCK_NORRIS_REDUCER_KEY]: ChuckNorrisState
}

export interface ChuckNorrisState {
  joke?: string
  error?: string
  loadingState: ChuckNorrisLoadingState
}
