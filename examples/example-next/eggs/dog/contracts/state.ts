import type { Immutable } from 'immer'

import type { DOG_REDUCER_KEY } from '@/eggs/dog/reducer'

export enum DogLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface DogAwareState {
  [DOG_REDUCER_KEY]: DogState
}

export type DogState = Immutable<{
  dog?: string
  error?: string
  loadingState: DogLoadingState
}>
