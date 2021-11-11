import { createSelector } from '@reduxjs/toolkit'

import type { FoxAwareState } from '@/eggs/fox/contracts/state'
import { FoxLoadingState } from '@/eggs/fox/contracts/state'
import { FOX_SLICE } from '@/eggs/fox/slice'

export const foxSelector = (state: FoxAwareState): string | undefined => {
  return state[FOX_SLICE].fox
}

export const errorSelector = (state: FoxAwareState): string | undefined => {
  return state[FOX_SLICE].error
}

export const loadingStateSelector = (state: FoxAwareState): FoxLoadingState => {
  return state[FOX_SLICE].loadingState
}

export const isFoxLoading = createSelector(loadingStateSelector, (loadingState: FoxLoadingState): boolean => {
  return loadingState === FoxLoadingState.LOADING
})
