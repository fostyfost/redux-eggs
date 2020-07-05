import { CHUCK_NORRIS_MODULE_NAME } from '../index'
import { Immutable } from 'immer'

export enum ChuckNorrisLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ChuckNorrisAwareState {
  [CHUCK_NORRIS_MODULE_NAME]: ChuckNorrisState
}

export type ChuckNorrisState = Immutable<{
  joke?: string
  error?: string
  loadingState: ChuckNorrisLoadingState
}>
