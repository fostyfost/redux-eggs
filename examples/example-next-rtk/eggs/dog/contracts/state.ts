import type { DOG_SLICE } from '@/eggs/dog/slice'

export enum DogLoadingState {
  NEVER = 'NEVER',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface DogAwareState {
  [DOG_SLICE]: DogState
}

export interface DogState {
  dog?: string
  error?: string
  loadingState: DogLoadingState
}
