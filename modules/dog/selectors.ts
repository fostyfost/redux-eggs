import { createSelector } from 'reselect'

import type { DogAwareState } from './contracts/state'
import { DogLoadingState } from './contracts/state'
import { DOG_MODULE_NAME } from './index'

export const dogSelector = (state: DogAwareState): string | undefined => {
  return state[DOG_MODULE_NAME].dog
}

export const errorSelector = (state: DogAwareState): string | undefined => {
  return state[DOG_MODULE_NAME].error
}

export const loadingStateSelector = (state: DogAwareState): DogLoadingState => {
  return state[DOG_MODULE_NAME].loadingState
}

export const isDogLoading = createSelector(loadingStateSelector, (loadingState: DogLoadingState): boolean => {
  return loadingState === DogLoadingState.LOADING
})
