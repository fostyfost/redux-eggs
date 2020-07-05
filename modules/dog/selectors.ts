import { createSelector } from 'reselect'

import { DOG_MODULE_NAME } from './index'
import { DogAwareState, DogLoadingState } from './contracts/state'

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
