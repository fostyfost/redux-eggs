import type { Immutable } from 'immer'

import type { DOG_SLICE } from '@/eggs/dog/slice'

export enum DogLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface DogAwareState {
  [DOG_SLICE]: DogState
}

export type DogState = Immutable<{
  dog?: string
  error?: string
  loadingState: DogLoadingState
}>
