import { createSelector } from '@reduxjs/toolkit'

import type { DogAwareState } from '@/eggs/dog/contracts/state'
import { DogLoadingState } from '@/eggs/dog/contracts/state'
import { DOG_SLICE } from '@/eggs/dog/slice'

export const dogSelector = (state: DogAwareState): string | undefined => {
  return state[DOG_SLICE].dog
}

export const errorSelector = (state: DogAwareState): string | undefined => {
  return state[DOG_SLICE].error
}

export const loadingStateSelector = (state: DogAwareState): DogLoadingState => {
  return state[DOG_SLICE].loadingState
}

export const isDogLoading = createSelector(
  loadingStateSelector,
  (loadingState: DogLoadingState): boolean => loadingState === DogLoadingState.LOADING,
)
