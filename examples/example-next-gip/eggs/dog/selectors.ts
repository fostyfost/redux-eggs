import { createSelector } from 'reselect'

import type { DogAwareState } from '@/eggs/dog/contracts/state'
import { DogLoadingState } from '@/eggs/dog/contracts/state'
import { DOG_REDUCER_KEY } from '@/eggs/dog/reducer'

export const dogSelector = (state: DogAwareState): string | undefined => {
  return state[DOG_REDUCER_KEY].dog
}

export const errorSelector = (state: DogAwareState): string | undefined => {
  return state[DOG_REDUCER_KEY].error
}

export const loadingStateSelector = (state: DogAwareState): DogLoadingState => {
  return state[DOG_REDUCER_KEY].loadingState
}

export const isDogLoading = createSelector(loadingStateSelector, (loadingState: DogLoadingState): boolean => {
  return loadingState === DogLoadingState.LOADING
})
