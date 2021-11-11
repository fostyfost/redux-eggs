import { createSelector } from '@reduxjs/toolkit'

import type { Picture } from '@/eggs/picsum/contracts/picture'
import type { PicsumAwareState } from '@/eggs/picsum/contracts/state'
import { PicsumLoadingState } from '@/eggs/picsum/contracts/state'
import { PICSUM_SLICE } from '@/eggs/picsum/slice'

export const picsSelector = (state: PicsumAwareState): Picture[] | undefined => {
  return state[PICSUM_SLICE].pics
}

export const errorSelector = (state: PicsumAwareState): string | undefined => {
  return state[PICSUM_SLICE].error
}

export const loadingStateSelector = (state: PicsumAwareState): PicsumLoadingState => {
  return state[PICSUM_SLICE].loadingState
}

export const isPicsLoading = createSelector(loadingStateSelector, (loadingState: PicsumLoadingState): boolean => {
  return loadingState === PicsumLoadingState.LOADING
})
