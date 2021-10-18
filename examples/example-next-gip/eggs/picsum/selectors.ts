import type { Immutable } from 'immer'
import { createSelector } from 'reselect'

import type { Picture } from '@/eggs/picsum/contracts/picture'
import type { PicsumAwareState } from '@/eggs/picsum/contracts/state'
import { PicsumLoadingState } from '@/eggs/picsum/contracts/state'
import { PICSUM_REDUCER_KEY } from '@/eggs/picsum/reducer'

export const picsSelector = (state: PicsumAwareState): Immutable<Picture[]> | undefined => {
  return state[PICSUM_REDUCER_KEY].pics
}

export const errorSelector = (state: PicsumAwareState): string | undefined => {
  return state[PICSUM_REDUCER_KEY].error
}

export const loadingStateSelector = (state: PicsumAwareState): PicsumLoadingState => {
  return state[PICSUM_REDUCER_KEY].loadingState
}

export const isPicsLoading = createSelector(loadingStateSelector, (loadingState: PicsumLoadingState): boolean => {
  return loadingState === PicsumLoadingState.LOADING
})
