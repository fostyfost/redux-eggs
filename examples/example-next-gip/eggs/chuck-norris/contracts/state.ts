import type { Immutable } from 'immer'

import type { CHUCK_NORRIS_REDUCER_KEY } from '@/eggs/chuck-norris/reducer'

export enum ChuckNorrisLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ChuckNorrisAwareState {
  [CHUCK_NORRIS_REDUCER_KEY]: ChuckNorrisState
}

export type ChuckNorrisState = Immutable<{
  joke?: string
  error?: string
  loadingState: ChuckNorrisLoadingState
}>
