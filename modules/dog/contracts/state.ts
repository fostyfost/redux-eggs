import type { Immutable } from 'immer'

import type { DOG_MODULE_NAME } from '../index'

export enum DogLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface DogAwareState {
  [DOG_MODULE_NAME]: DogState
}

export type DogState = Immutable<{
  dog?: string
  error?: string
  loadingState: DogLoadingState
}>
