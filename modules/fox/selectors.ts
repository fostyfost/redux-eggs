import { createSelector } from 'reselect'

import type { FoxAwareState } from './contracts/state'
import { FoxLoadingState } from './contracts/state'
import { FOX_MODULE_NAME } from './index'

export const foxSelector = (state: FoxAwareState): string | undefined => {
  return state[FOX_MODULE_NAME].fox
}

export const errorSelector = (state: FoxAwareState): string | undefined => {
  return state[FOX_MODULE_NAME].error
}

export const loadingStateSelector = (state: FoxAwareState): FoxLoadingState => {
  return state[FOX_MODULE_NAME].loadingState
}

export const isFoxLoading = createSelector(loadingStateSelector, (loadingState: FoxLoadingState): boolean => {
  return loadingState === FoxLoadingState.LOADING
})
