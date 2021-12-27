import { createSelector } from 'reselect'

import type { DogAwareState, DogState } from './contracts/state'
import { DogLoadingState } from './contracts/state'
import { DOG_REDUCER_KEY, initialState } from './reducer'

const stateSelector = (state: DogAwareState): DogState => {
  return state[DOG_REDUCER_KEY] ?? initialState
}

export const dogSelector = (state: DogAwareState): string | undefined => {
  return stateSelector(state).dog
}

export const loadingStateSelector = (state: DogAwareState): DogLoadingState => {
  return stateSelector(state).loadingState
}

export const isDogLoading = createSelector(loadingStateSelector, (loadingState: DogLoadingState): boolean => {
  return loadingState === DogLoadingState.LOADING
})
