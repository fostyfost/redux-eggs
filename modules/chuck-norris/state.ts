import { CHUCK_NORRIS_MODULE_NAME } from './index'

export enum ChuckNorrisLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ChuckNorrisAwareState {
  [CHUCK_NORRIS_MODULE_NAME]: ChuckNorrisState
}

export interface ChuckNorrisState {
  joke?: string
  error?: string
  loadingState: ChuckNorrisLoadingState
}

export const chuckNorrisInitialState = {
  loadingState: ChuckNorrisLoadingState.NEVER,
}
