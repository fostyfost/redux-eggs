import type { CHUCK_NORRIS_REDUCER_KEY } from '../reducer'

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
  loadingState: ChuckNorrisLoadingState
}
