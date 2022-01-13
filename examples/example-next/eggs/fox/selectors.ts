import { createSelector } from 'reselect'

import type { FoxAwareState } from '@/eggs/fox/contracts/state'
import { FoxLoadingState } from '@/eggs/fox/contracts/state'
import { FOX_REDUCER_KEY } from '@/eggs/fox/reducer'

export const foxSelector = (state: FoxAwareState): string | undefined => {
  return state[FOX_REDUCER_KEY].fox
}

export const errorSelector = (state: FoxAwareState): string | undefined => {
  return state[FOX_REDUCER_KEY].error
}

export const loadingStateSelector = (state: FoxAwareState): FoxLoadingState => {
  return state[FOX_REDUCER_KEY].loadingState
}

export const isFoxLoading = createSelector(
  loadingStateSelector,
  (loadingState: FoxLoadingState): boolean => loadingState === FoxLoadingState.LOADING,
)
